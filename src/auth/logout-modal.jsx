import { useTranslation } from "react-i18next";
import { EuiConfirmModal } from "@elastic/eui";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../api/auth.js";
import { useNavigate } from "react-router-dom";

export function LogoutModal({ onCancel }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate("/auth/login")
  });

  return (
    <EuiConfirmModal
      title={t("logout", { ns: "auth" })}
      onCancel={onCancel}
      onConfirm={mutate}
      cancelButtonText={t("cancel", { ns: "common" })}
      confirmButtonText={t("logout", { ns: "auth" })}
      defaultFocusedButton="cancel"
      isLoading={isLoading}
    >
      <p>
        {t("logoutConfirmation", { ns: "auth" })}
      </p>
    </EuiConfirmModal>
  )
}
