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
import { useMutation } from "@tanstack/react-query";
import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { deleteOne } from "../api/category.js";

export function DeleteCategoryModal({ onCancel, category }) {
  const [value, setValue] = useState("");
  const formId = useGeneratedHtmlId({ prefix: "modalForm" });
  const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: (id) => deleteOne(id), mutationKey: ["categories"] });

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(category.id);
    onCancel();
  }

  return (
    <EuiModal onClose={onCancel}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h3>{t("deleteCategory", { ns: "category" })}</h3>
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
