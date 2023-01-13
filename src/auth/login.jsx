import { Button, Page, Text, Input, Grid, Spacer, Note } from "@geist-ui/core";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";
import { useContext } from "preact/hooks";
import { AuthContext } from "./state.jsx";
import { useTranslation } from "react-i18next";

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { mutate, isLoading, error } = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (result) => {
      if (result.has_credential) {
        navigate(`/auth/webauthn?token=${result.token}`)
      } else {
        setUser(result.user);
        navigate("/")
      }
    }
  });

  const { t } = useTranslation();

  const onLogin = (e) => {
    e.preventDefault();
    mutate(Object.fromEntries(new FormData(e.target)))
  }

  return (
    <Page>
      <Page.Content>
        <form action="/auth/login" method="post" onSubmit={onLogin}>
          <Grid.Container direction="column" alignContent="center" width="20rem" margin="auto">
            <Text h3>{t("login", { ns: "auth" })}</Text>
            {error ? (
              <>
                <Spacer h={1} />
                <Note type="error" label={false}>{error.message}</Note>
                <Spacer h={1} />
              </>
            ) : null}
            <Input placeholder="juraev@mailinator.com" width="100%" htmlType="email" autoComplete="on" name="identifier" id="identifier">
              {t("email", { ns: "auth" })}
            </Input>
            <Spacer h={1} />
            <Input.Password placeholder="complicated-passphrase" width="100%" name="password">
              {t("password", { ns: "auth" })}
            </Input.Password>
            <Spacer h={1} />
            <Button width="100%" htmlType="submit" loading={isLoading}>{t("login", { ns: "auth" })}</Button>
          </Grid.Container>
        </form>
      </Page.Content>
    </Page>
  )
}
