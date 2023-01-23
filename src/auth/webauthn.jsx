import { generateRequest, verifyAssertion } from "../api/auth.js";
import { decode, encode } from "../utils/base64-url.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "preact/hooks";
import { AuthContext } from "./state.jsx";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText, EuiButton } from "@elastic/eui";

export function Webauthn() {
  const { setUser } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);

  const onAuthenticate = async () => {
    const assertionReq = await generateRequest({ token: params.get("token") });
      assertionReq.allowCredentials = assertionReq.allowCredentials.map((credential) => ({
        ...credential,
        id: decode(credential.id)
      }))

    const oldChallenge = assertionReq.challenge;
    assertionReq.challenge = decode(assertionReq.challenge);

    const assertion = await window.navigator.credentials.get({
      publicKey: assertionReq
    })

    const [raw_id, authenticator_data, client_data_json, signature, user_handle] = await Promise.all([
      encode(assertion.rawId),
      encode(assertion.response.authenticatorData),
      encode(assertion.response.clientDataJSON),
      encode(assertion.response.signature),
      encode(assertion.response.userHandle),
    ]);

    return await verifyAssertion({
      token: params.get("token"),
      challenge: oldChallenge,
      assertion: {
        id: assertion.id,
        raw_id,
        response: {
          authenticator_data,
          client_data_json,
          signature,
          user_handle,
        },
      }
    })
  }

  const { mutate, isLoading, error } = useMutation({
    mutationFn: onAuthenticate,
    onSuccess: (result) => {
      setUser(result.user);
      navigate("/");
    }
  })


  return (
    <EuiFlexGroup justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
      <EuiFlexItem grow={false} style={{ maxWidth: 400, width: "100%" }}>
        <EuiPanel paddingSize="m">
          <EuiFlexGroup direction="column" gutterSize="l" style={{ width: "100%" }}>
            <EuiFlexItem>
              <EuiText>
                <h2>{t("2-factor", { ns: "auth" })}</h2>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiButton autoFocus onClick={mutate} type="submit" fill isLoading={isLoading}>{t("useSecurityKey", { ns: "auth" })}</EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}
