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
  EuiButton,
  EuiComboBox
} from "@elastic/eui";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getMany } from "../api/category.js";
import { createOne, getTranslations } from "../api/attribute.js";
import { unflatten } from "../utils/index.js";
import { useState, useMemo, useCallback } from "preact/hooks"

const typeOptions = [
  {
    label: "Checkbox",
    value: "checkbox"
  },
  {
    label: "Radio",
    value: "radio"
  },
  {
    label: "Select",
    value: "select"
  },
  {
    label: "Text",
    value: "text"
  },
  {
    label: "Search",
    value: "search"
  },
  {
    label: "URL",
    value: "url"
  },
  {
    label: "Number",
    value: "number"
  },
  {
    label: "File",
    value: "file"
  },
  {
    label: "Tel",
    value: "tel"
  },
  {
    label: "Password",
    value: "password"
  },
  {
    label: "Range",
    value: "range"
  }
];

export function EditAttributeModal({ onCancel, attribute }) {
  const queryClient = useQueryClient();
  const formId = useGeneratedHtmlId({ prefix: "modalForm" });
  const [selectedType, setSelectedType] = useState(() => typeOptions.filter((op) => op.value === attribute.type));
  const { data: translations } = useQuery({ queryKey: ["attributes", attribute.id], queryFn: () => getTranslations(attribute.id) });
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: () =>  getMany({ format: "flat" }) });
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState(() => categories?.filter((c) => attribute.category_set.includes(c.id)).map((item) => ({ label: item.title, value: item.id })));
  const categoryOptions = useMemo(() => categories?.map((item) => ({ label: item.title, value: item.id })), [categories]);
  const { t } = useTranslation();
  const mutation = useMutation({
    mutationFn: (data) => createOne(data),
    mutationKey: ["attributes"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      onCancel();
  }});

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const data = unflatten(Object.fromEntries(new FormData(e.target)))
    mutation.mutate(Object.assign(data, { type: selectedType?.[0]?.value, category_set: selectedCategoryOptions.map((c) => c.value) }));
  }, [selectedType, selectedCategoryOptions])

  return (
    <EuiModal onClose={onCancel}>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h3>{t("editAttribute", { ns: "attribute" })}</h3>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm id={formId} component="form" onSubmit={onSubmit}>
          <input type="hidden" name="translation.0.language_code" value="ru" />
          <input type="hidden" name="translation.1.language_code" value="uz" />
          <input type="hidden" name="translation.2.language_code" value="en" />
          {attribute ? (
            <input name="parent_id" type="hidden" value={attribute.id} />
          ) : null}
          <EuiFormRow label={t("inRussian", { ns: "attribute" })}>
            <EuiFieldText placeholder="Ремонт" name="translation.0.name" defaultValue={translations?.find((tr) => tr.language_code === "ru")?.name} />
          </EuiFormRow>
          <EuiFormRow label={t("inUzbek", { ns: "attribute" })}>
            <EuiFieldText placeholder="Ta'mir" name="translation.1.name" defaultValue={translations?.find((tr) => tr.language_code === "uz")?.name} />
          </EuiFormRow>
          <EuiFormRow label={t("inEnglish", { ns: "attribute" })}>
            <EuiFieldText placeholder="Repair" name="translation.2.name" defaultValue={translations?.find((tr) => tr.language_code === "en")?.name} />
          </EuiFormRow>
          <EuiFormRow label={t("type", { ns: "attribute" })}>
            <EuiComboBox
              placeholder={t("chooseType", { ns: "attribute" })}
              selectedOptions={selectedType}
              onChange={(selected) => setSelectedType(selected)}
              options={typeOptions}
              singleSelection={true}
            ></EuiComboBox>
          </EuiFormRow>
          <EuiFormRow label={t("attributeCategories", { ns: "attribute" })}>
            <EuiComboBox
              placeholder={t("chooseAssociatedCategories", { ns: "attribute" })}
              selectedOptions={selectedCategoryOptions}
              options={categoryOptions}
              onChange={(selected) => setSelectedCategoryOptions(selected)}>
            </EuiComboBox>
          </EuiFormRow>
        </EuiForm>
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancel}>{t("cancel", { ns: "common" })}</EuiButtonEmpty>
        <EuiButton fill type="submit" form={formId}>{t("edit", { ns: "common" })}</EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}
