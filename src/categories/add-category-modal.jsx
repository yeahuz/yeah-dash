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
import { useMutation } from "@tanstack/react-query";
import { createOne } from "../api/category.js";


function unflatten(data) {
  var result = {}
  for (var i in data) {
    var keys = i.split('.')
    keys.reduce(function (r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
    }, result)
  }
  return result
}
export function AddCategoryModal({ onCancel, category }) {
  const formId = useGeneratedHtmlId({ prefix: "modalForm" });
  const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: (data) => createOne(data), mutationKey: ["categories"] });

  const onSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(unflatten(Object.fromEntries(new FormData(e.target))));
    onCancel();
  }

//     <Modal {...bindings}>
//       <Modal.Title>
//         {category ? t("addSubCategory", { ns: "category", category: category.title }) : t("addCategory", { ns: "category" })}
//       </Modal.Title>
//       <Modal.Content>
//         <form onSubmit={onSubmit} method="post">
//           {category ? (
//             <input name="parent_id" type="hidden" value={category.id} />
//           ) : null}
//           <Grid.Container direction="column" gap={1.5}>
//             <Grid>
//               <input name="translation.0.language_code" type="hidden" value="ru" />
//               <Input placeholder="Недвижимость" name="translation.0.title" width="100%">{t("inRussian", { ns: "category" })}</Input>
//             </Grid>
//             <Grid>
//               <input name="translation.1.language_code" type="hidden" value="uz" />
//               <Input placeholder="Ko'chmas mulk" name="translation.1.title" width="100%">{t("inUzbek", { ns: "category" })}</Input>
//             </Grid>
//             <Grid>
//               <input name="translation.2.language_code" type="hidden" value="en" />
//               <Input placeholder="Real estate" name="translation.2.title" width="100%">{t("inEnglish", { ns: "category" })}</Input>
//             </Grid>
//             <Grid>
//               <Button htmlType="submit">Submit</Button>
//             </Grid>
//           </Grid.Container>
//         </form>
//       </Modal.Content>
//       <Modal.Action passive onClick={() => setVisible(false)}>{t("cancel", { ns: "common" })}</Modal.Action>
//       <Modal.Action>{t("add", { ns: "common" })}</Modal.Action>
//     </Modal>

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
