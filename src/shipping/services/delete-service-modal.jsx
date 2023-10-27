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
import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";

export function DeleteServiceModal({ onCancel }) {
  const [value, setValue] = useState("");
  const formId = useGeneratedHtmlId({ prefix: "modalForm" });
  const { t } = useTranslation();
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("here");
  }

  return (
    <EuiModal onClose={onCancel}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h3>{t("deleteService", { ns: "shipping" })}</h3>
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
