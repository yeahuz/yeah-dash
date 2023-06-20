import { useTranslation } from "react-i18next";
import { EuiConfirmModal } from "@elastic/eui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOne } from "../api/posting";

export function IndexPostingModal({ onCancel, posting }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: () => updateOne(posting.id, { status_id: 4 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postings"] });
      onCancel()
    }
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
