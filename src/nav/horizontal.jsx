import { Tabs, Grid, Text, Spacer, User, Button, useModal, Modal } from "@geist-ui/core";
import { useContext } from "preact/hooks";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../auth/state.jsx";
import { useApi } from "../core/useApi.js";
import { logout } from "../api/auth.js";
import { option } from "../utils/option.js";
import { useTranslation } from "react-i18next";

export function HorizontalNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { setVisible, bindings } = useModal();
  const { isLoading, run, error } = useApi();

  const onLogout = async () => {
    const [_, err] = await option(run(logout()));
    if (!err) {
      navigate("/auth/login");
    }
  }

  return (
    <Grid.Container direction="column">
      <Modal {...bindings}>
        <Modal.Title>
          {t("logout", { ns: "auth" })}
        </Modal.Title>
        <Modal.Content>
          {error ? (
            <Text blockquote font="0.875rem">{error.message}</Text>
          ) : null}
          <Text>{t("logoutConfirmation", { ns: "auth" })}</Text>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)} loading={isLoading}>{t("no", { ns: "common" })}</Modal.Action>
        <Modal.Action onClick={onLogout} loading={isLoading}>{t("yes", { ns: "common" })}</Modal.Action>
      </Modal>
      <Spacer h={1} />
      <Grid.Container justify="space-between">
        <Text h4>
          <Link to="/">Dashboard</Link>
        </Text>
        <Grid style="display: flex; gap:1rem;">
          {user ? (
            <>
              <User src={user.profile_photo_url} name={user.name}></User>
              <Button auto onClick={() => setVisible(true)}>{t("logout", { ns: "auth" })}</Button>
            </>
          ) : null}
        </Grid>
      </Grid.Container>
      <Tabs value={location.pathname} onChange={(path) => navigate(path)}>
        {/* <Tabs.Item label="Users" value="/users"></Tabs.Item> */}
        <Tabs.Item label={t("postings", { ns: "posting" })} value="/postings"></Tabs.Item>
      </Tabs>
    </Grid.Container>
  )
}
