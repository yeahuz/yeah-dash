import { Tabs, Grid, Text, Spacer, User, Button, useModal, Modal, Note } from "@geist-ui/core";
import { useContext } from "preact/hooks";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../auth/state.jsx";
import { logout } from "../api/auth.js";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

export function HorizontalNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { setVisible, bindings } = useModal();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate("/auth/login")
  });

  return (
    <Grid.Container direction="column">
      <Modal {...bindings}>
        <Modal.Title>
          {t("logout", { ns: "auth" })}
        </Modal.Title>
        <Modal.Content>
          {mutation.isError ? (
            <>
              <Spacer h={1} />
              <Note type="error" label={false}>{mutation.error.message}</Note>
              <Spacer h={1} />
            </>
          ) : null}
          <Text>{t("logoutConfirmation", { ns: "auth" })}</Text>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)} loading={mutation.isLoading}>{t("no", { ns: "common" })}</Modal.Action>
        <Modal.Action onClick={() => mutation.mutate()} loading={mutation.isLoading}>{t("yes", { ns: "common" })}</Modal.Action>
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
