import { Button, Page, Text, Grid, Spacer, Note } from "@geist-ui/core";
import { useApi } from "../core/useApi.js";
import { option } from "../utils/option.js";
import { generateRequest, verifyAssertion } from "../api/auth.js";
import { decode, encode } from "../utils/base64-url.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "preact/hooks";
import { AuthContext } from "./state.jsx";
import { useTranslation } from "react-i18next";

export function Webauthn() {
  const { run, isLoading, error } = useApi();
  const { setUser } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);

  const onAuthenticate = async (e) => {
    e.preventDefault();
    const [assertionRequest, err] = await option(run(generateRequest({ token: params.get("token") })))
    if (!err) {
      assertionRequest.allowCredentials = assertionRequest.allowCredentials.map((credential) => ({
        ...credential,
        id: decode(credential.id)
      }))

      const oldChallenge = assertionRequest.challenge;
      assertionRequest.challenge = decode(assertionRequest.challenge);

      const assertion = await window.navigator.credentials.get({
        publicKey: assertionRequest
      })
      const [raw_id, authenticator_data, client_data_json, signature, user_handle] = await Promise.all([
        encode(assertion.rawId),
        encode(assertion.response.authenticatorData),
        encode(assertion.response.clientDataJSON),
        encode(assertion.response.signature),
        encode(assertion.response.userHandle),
      ]);

      const [result, verificationErr] = await option(run(verifyAssertion({
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
      })));

      if (!verificationErr) {
        setUser(result.user);
        navigate("/")
      }
    }
  }

  return (
    <Page>
      <Page.Content>
        <form action="/auth/requests" onSubmit={onAuthenticate}>
          <Grid.Container direction="column" alignContent="center" width="20rem" margin="auto">
            <Text h3>{t("2-factor", { ns: "auth" })}</Text>
            {error ? (
              <Note type="error" label={false}>{error.message}</Note>
            ) : null}
            <Spacer h={1} />
            <Button width="100%" htmlType="submit" loading={isLoading}>{t("useSecurityKey", { ns: "auth" })}</Button>
          </Grid.Container>
        </form>
      </Page.Content>
    </Page>
  )
}
