import {
  EuiFormRow,
  EuiFieldText,
  useGeneratedHtmlId,
  EuiForm,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButtonEmpty,
  EuiButton
} from "@elastic/eui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { deleteOne } from "../api/attribute.js";

export function DeleteAttributeModal({ onCancel, attribute }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const formId = useGeneratedHtmlId({ prefix: "modalForm" });
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: (id) => deleteOne(id),
    mutationKey: ["attributes"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      onCancel();
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(attribute.id);
  }

  return (
    <EuiModal onClose={onCancel}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h3>{t("deleteAttribute", { ns: "attribute" })}</h3>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm id={formId} component="form" onSubmit={onSubmit}>
          <EuiFormRow label={t("typeToConfirm", { ns: "common", word: "delete" })}>
            <EuiFieldText autoFocus placeholder="delete" name="delete" value={value} onChange={({ target }) => setValue(target.value)} />
          </EuiFormRow>
        </EuiForm>
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancel}>{t("cancel", { ns: "common" })}</EuiButtonEmpty>
        <EuiButton color="danger" fill disabled={value.toLowerCase() !== "delete"} type="submit" form={formId}>{t("delete", { ns: "common" })}</EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}
