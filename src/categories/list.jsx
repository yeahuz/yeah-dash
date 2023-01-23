import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getMany, createOne } from "../api/category.js";

function unflatten(data) {
  var result = {}
  for (var i in data) {
    var keys = i.split('.')
    keys.reduce(function(r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
    }, result)
  }
  return result
}

// function CategoryTree({ data }) {
//   const { t } = useTranslation();
//   const { bindings, setVisible } = useModal();

//   return data.map((category) => {
//     return (
//       <>
//         <Tree.Folder name={category.title}>
//           {category.children.length ? <CategoryTree data={category.children} /> : null}
//           <Grid>
//             <Button onClick={() => setVisible(true)} scale={3/4} auto>{t("add", { ns: "common" })}</Button>
//           </Grid>
//         </Tree.Folder>
//       </>
//     )
//   });
// }

// function AddCategoryModal({ category }) {
//   const { t } = useTranslation();
//   const mutation = useMutation({ mutationFn: (data) => createOne(data), mutationKey: ["categories"] });
//   const { bindings, setVisible } = useModal();

//   const onSubmit = (e) => {
//     e.preventDefault();
//     mutation.mutate(unflatten(Object.fromEntries(new FormData(e.target))));
//   }

//   return (
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
//   )
// }

export function Categories() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({ queryKey: ["categories"], queryFn: getMany, retry: false });
  // const { bindings, setVisible } = useModal();

  return (
    <div>Categories</div>
    // <Grid.Container direction="column" gap={2}>
    //   <Grid>
    //     <Tree>
    //       {data ? <CategoryTree data={data} /> : null}
    //     </Tree>
    //   </Grid>
    //   <Grid>
    //     <Button auto scale={3/4} onClick={() => setVisible(true)}>{t("add", { ns: "common" })}</Button>
    //   </Grid>
    //   <Grid>
    //     <ButtonGroup scale={2 / 3}>
    //     </ButtonGroup>
    //   </Grid>
    // </Grid.Container>
  )
}
