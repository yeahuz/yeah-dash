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
import { createOne } from "../api/attribute.js";
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

export function AddAttributeModal({ onCancel, attribute }) {
  const queryClient = useQueryClient();
  const formId = useGeneratedHtmlId({ prefix: "modalForm" });
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState([]);
  const [selectedType, setSelectedType] = useState();
  const { data } = useQuery({ queryKey: ["categories"], queryFn: () =>  getMany({ format: "flat" }) });
  const categoryOptions = useMemo(() => data?.map((item) => ({ label: item.title, value: item.id })), [data]);
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
          <h3>{t("addAttribute", { ns: "attribute" })}</h3>
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
            <EuiFieldText placeholder="Ремонт" name="translation.0.name" />
          </EuiFormRow>
          <EuiFormRow label={t("inUzbek", { ns: "attribute" })}>
            <EuiFieldText placeholder="Ta'mir" name="translation.1.name" />
          </EuiFormRow>
          <EuiFormRow label={t("inEnglish", { ns: "attribute" })}>
            <EuiFieldText placeholder="Repair" name="translation.2.name" />
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
        <EuiButton fill type="submit" form={formId}>{t("add", { ns: "common" })}</EuiButton>
      </EuiModalFooter>
    </EuiModal>
  )
}
