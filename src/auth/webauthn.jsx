import { Button, Page, Text, Grid, Spacer, Note } from "@geist-ui/core";
import { generateRequest, verifyAssertion } from "../api/auth.js";
import { decode, encode } from "../utils/base64-url.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "preact/hooks";
import { AuthContext } from "./state.jsx";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

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
    },
    onMutate: (e) =>  {
      e.preventDefault();
    }
  })


  return (
    <Page>
      <Page.Content>
        <form action="/auth/requests" onSubmit={mutate}>
          <Grid.Container direction="column" alignContent="center" width="20rem" margin="auto">
            <Text h3>{t("2-factor", { ns: "auth" })}</Text>
            {error ? (
              <>
                <Spacer h={1} />
                <Note type="error" label={false}>{error.message}</Note>
                <Spacer h={1} />
              </>
            ) : null}
            <Spacer h={1} />
            <Button width="100%" htmlType="submit" loading={isLoading}>{t("useSecurityKey", { ns: "auth" })}</Button>
          </Grid.Container>
        </form>
      </Page.Content>
    </Page>
  )
}
