import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth.js";
import { useContext } from "preact/hooks";
import { AuthContext } from "./state.jsx";
import { useTranslation } from "react-i18next";
import { EuiFormRow, EuiFieldText, EuiForm, EuiFieldPassword, EuiText, EuiFlexGroup, EuiFlexItem, EuiButton, EuiCallOut, EuiPanel } from "@elastic/eui";

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
    <EuiFlexGroup justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
      <EuiFlexItem grow={false} style={{ maxWidth: 400, width: "100%" }}>
        <EuiPanel paddingSize="m">
          <EuiFlexGroup direction="column" gutterSize="l" style={{ width: "100%" }}>
            <EuiFlexItem>
              <EuiText>
                <h2>{t("login", { ns: "auth" })}</h2>
              </EuiText>
            </EuiFlexItem>
            {error ? (
              <EuiFlexItem>
                <EuiCallOut title={t("error", { ns: "common" })} color="danger" iconType="alert">
                  <p> {error.message} </p>
                </EuiCallOut>
              </EuiFlexItem>
            ) : null}
            <EuiFlexItem>
              <EuiForm component="form" action="/auth/login" method="post" onSubmit={onLogin}>
                <EuiFormRow label={t("email", { ns: "auth" })}>
                  <EuiFieldText autoFocus name="identifier" autoComplete="on" id="identifier" placeholder="juraev@mailinator.com" />
                </EuiFormRow>
                <EuiFormRow label={t("password", { ns: "auth" })}>
                  <EuiFieldPassword type="dual" name="password" placeholder="complicated-passphrase" />
                </EuiFormRow>
                <EuiButton type="submit" fill fullWidth isLoading={isLoading}>{t("login", { ns: "auth" })}</EuiButton>
              </EuiForm>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}
