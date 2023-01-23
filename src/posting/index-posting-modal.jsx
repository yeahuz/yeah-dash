import { useTranslation } from "react-i18next";
import { EuiConfirmModal } from "@elastic/eui";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function IndexPostingModal({ onCancel }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => console.log("mutate"),
    onSuccess: () => console.log("confirmed")
  });

  return (
    <EuiConfirmModal
      title={t("indexPosting", { ns: "posting" })}
      onCancel={onCancel}
      onConfirm={mutate}
      cancelButtonText={t("cancel", { ns: "common" })}
      confirmButtonText={t("index", { ns: "posting" })}
      defaultFocusedButton="cancel"
      isLoading={isLoading}
    ></EuiConfirmModal>
  )
}
