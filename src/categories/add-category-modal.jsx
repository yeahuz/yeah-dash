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
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOne } from "../api/category.js";
import { unflatten } from "../utils/index.js";

export function AddCategoryModal({ onCancel, category }) {
  const queryClient = useQueryClient();
  const formId = useGeneratedHtmlId({ prefix: "modalForm" });
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: (data) => createOne(data),
    mutationKey: ["categories"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onCancel();
  }});

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(unflatten(Object.fromEntries(new FormData(e.target))));
  }

  return (
    <EuiModal onClose={onCancel}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h3>{t("addCategory", { ns: "category" })}</h3>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm id={formId} component="form" onSubmit={onSubmit}>
          <input type="hidden" name="translation.0.language_code" value="ru" />
          <input type="hidden" name="translation.1.language_code" value="uz" />
          <input type="hidden" name="translation.2.language_code" value="en" />
          {category ? (
            <input name="parent_id" type="hidden" value={category.id} />
          ) : null}
          <EuiFormRow label={t("inRussian", { ns: "category" })}>
            <EuiFieldText autoFocus placeholder="Недвижимость" name="translation.0.title" />
          </EuiFormRow>
          <EuiFormRow label={t("inUzbek", { ns: "category" })}>
            <EuiFieldText placeholder="Ko'chmas mulk" name="translation.1.title" />
          </EuiFormRow>
          <EuiFormRow label={t("inEnglish", { ns: "category" })}>
            <EuiFieldText placeholder="Real estate" name="translation.2.title" />
          </EuiFormRow>
        </EuiForm>
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancel}>{t("cancel", { ns: "common" })}</EuiButtonEmpty>
        <EuiButton fill type="submit" form={formId}>{t("add", { ns: "common" })}</EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}
