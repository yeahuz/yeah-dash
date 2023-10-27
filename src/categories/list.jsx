import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getMany } from "../api/category.js";
import { EuiFlexGroup, EuiFlexItem, EuiButtonIcon, EuiToolTip, EuiPanel, EuiButtonEmpty } from "@elastic/eui";
import { useState } from "preact/hooks";
import { DeleteCategoryModal } from "./delete-category-modal.jsx";
import { AddCategoryModal } from "./add-category-modal.jsx";

function CategoryTree({ data, depth = 0, open = {}, setOpen, parentId, setDeletingCategory, setParentCategory } = {}) {
  const { t } = useTranslation();
  return (
    <EuiFlexGroup direction="column" gutterSize="none">
      {data?.map((category) => (
        <EuiFlexItem style={{ display: depth === 0 ? "block" : (open[parentId] ? "block" : "none") }}>
          <EuiPanel className="euiTableRow" paddingSize="m" hasShadow={false} hasBorder={false} color="transparent" borderRadius="none">
            <EuiFlexGroup alignItems="center" gutterSize="s">
              {category.children?.length ? (
                <EuiFlexItem grow={false} style={{ marginLeft: depth * 32 }}>
                  <EuiButtonIcon area-label="Expand" iconType={open[category.id] ? "arrowDown" : "arrowRight"} color="text" onClick={() => setOpen(prev => ({ ...prev, [category.id]: !prev[category.id] }))} />
                </EuiFlexItem>
              ) : null}
              <EuiFlexItem grow={false} style={{ marginLeft: !category.children.length ? (depth === 0 && !category.children.length ? 1 : depth) * 32 : 0 }}>
                {category.title}
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiFlexGroup gutterSize="s" alignItems="center">
                  <EuiFlexItem>
                    <EuiToolTip position="top" content={t("add", { ns: "common" })}>
                      <EuiButtonIcon aria-label={t("add", { ns: "common" })} iconType="plusInCircle" onClick={() => setParentCategory(category)}></EuiButtonIcon>
                    </EuiToolTip>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiToolTip position="top" content={t("delete", { ns: "common" })}>
                      <EuiButtonIcon aria-label={t("add", { ns: "common" })} color="danger" iconType="trash" onClick={() => setDeletingCategory(category)}></EuiButtonIcon>
                    </EuiToolTip>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
          {category.children.length ? <CategoryTree
            data={category.children}
            depth={depth + 1}
            parentId={category.id}
            open={open}
            setOpen={setOpen}
            setDeletingCategory={setDeletingCategory}
            setParentCategory={setParentCategory}
          /> : null}
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  )
}


export function Categories() {
  const { data } = useQuery({ queryKey: ["categories"], queryFn: () => getMany({ format: "tree" }) });
  const [open, setOpen] = useState({})
  const [deletingCategory, setDeletingCategory] = useState();
  const [addingCategory, setAddingCategory] = useState();
  const [parentCategory, setParentCategory] = useState();
  const { t } = useTranslation();

  return (
    <>
      <EuiPanel paddingSize="none" hasShadow={false} borderRadius="none">
        <CategoryTree data={data} open={open} setOpen={setOpen} setDeletingCategory={setDeletingCategory} setParentCategory={setParentCategory} />
        <EuiPanel paddingSize="m" hasShadow={false} color="transparent">
          <EuiButtonEmpty iconType="plusInCircleFilled" size="s" aria-label={t("addCategory", { ns: "category" })} onClick={() => setAddingCategory(true)}>{t("addCategory", { ns: "category" })}</EuiButtonEmpty>
        </EuiPanel>
      </EuiPanel>
      {deletingCategory ? <DeleteCategoryModal category={deletingCategory} onCancel={() => setDeletingCategory(null)} /> : null}
      {addingCategory || parentCategory ? <AddCategoryModal category={parentCategory} onCancel={() => {
        setAddingCategory(false);
        setParentCategory(null);
      }} /> : null}
    </>
  )
}
