import { useTranslation } from "react-i18next";
import { EuiConfirmModal } from "@elastic/eui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOne } from "../api/listing";

export function IndexListingModal({ onCancel, listing }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: () => updateOne(listing.id, { status_id: 4 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      onCancel()
    }
  });

  return (
    <EuiConfirmModal
      title={t("indexListing", { ns: "listing" })}
      onCancel={onCancel}
      onConfirm={mutate}
      cancelButtonText={t("cancel", { ns: "common" })}
      confirmButtonText={t("index", { ns: "listing" })}
      defaultFocusedButton="cancel"
      isLoading={isLoading}
    ></EuiConfirmModal>
  )
}
