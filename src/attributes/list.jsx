import { useQuery } from "@tanstack/react-query";
import { getMany } from "../api/attribute.js";
import { EuiPanel, EuiButtonEmpty, EuiFlexGroup, EuiFlexItem, EuiButtonIcon, EuiToolTip } from "@elastic/eui";
import { useTranslation } from "react-i18next";
import { useState } from "preact/hooks";
import { AddAttributeModal } from "./add-attribute-modal.jsx";
import { DeleteAttributeModal } from "./delete-attribute-modal.jsx";
import { EditAttributeModal } from "./edit-attribute-modal.jsx";

function AttributeTree({ data, depth = 0, open = {}, setOpen, parentId, setDeletingAttribute, setParentAttribute, setEditingAttribute } = {}) {
  const { t } = useTranslation();
  return (
    <EuiFlexGroup direction="column" gutterSize="none">
      {data?.map((attribute) => (
        <EuiFlexItem style={{ display: depth === 0 ? "block" : (open[parentId] ? "block" : "none") }}>
          <EuiPanel className="euiTableRow" paddingSize="m" hasShadow={false} hasBorder={false} color="transparent" borderRadius="none">
            <EuiFlexGroup alignItems="center" gutterSize="s">
              {attribute.children.length ? (
                <EuiFlexItem grow={false} style={{ marginLeft: depth * 32 }}>
                  <EuiButtonIcon area-label="Expand" iconType={open[attribute.id] ? "arrowDown" : "arrowRight"} color="text" onClick={() => setOpen(prev => ({ ...prev, [attribute.id]: !prev[attribute.id] }))} />
                </EuiFlexItem>
              ) : null}
              <EuiFlexItem grow={false} style={{ marginLeft: !attribute.children.length ? (depth === 0 && !attribute.children.length ? 1 : depth) * 32 : 0 }}>
                {attribute.name}
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiFlexGroup gutterSize="s" alignItems="center">
                  {attribute.type === "checkbox" || attribute.type === "radio" ? (
                      <EuiFlexItem>
                        <EuiToolTip position="top" content={t("add", { ns: "common" })}>
                          <EuiButtonIcon aria-label={t("add", { ns: "common" })} iconType="plusInCircle" onClick={() => setParentAttribute(attribute)}></EuiButtonIcon>
                        </EuiToolTip>
                      </EuiFlexItem>
                    ) : null}
                  <EuiFlexItem>
                    <EuiToolTip position="top" content={t("edit", { ns: "common" })}>
                      <EuiButtonIcon aria-label={t("edit", { ns: "common" })} iconType="pencil" onClick={() => setEditingAttribute(attribute)}></EuiButtonIcon>
                    </EuiToolTip>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiToolTip position="top" content={t("delete", { ns: "common" })}>
                      <EuiButtonIcon aria-label={t("add", { ns: "common" })} color="danger" iconType="trash" onClick={() => setDeletingAttribute(attribute)}></EuiButtonIcon>
                    </EuiToolTip>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
          {attribute.children.length ? <AttributeTree
            data={attribute.children}
            depth={depth + 1}
            parentId={attribute.id}
            open={open}
            setOpen={setOpen}
            setDeletingAttribute={setDeletingAttribute}
            setParentAttribute={setParentAttribute}
          /> : null}
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  )
}

export function Attributes() {
  const { data } = useQuery({ queryKey: ["attributes"], queryFn: getMany });
  const { t } = useTranslation();
  const [open, setOpen] = useState({})
  const [parentAttribute, setParentAttribute] = useState();
  const [deletingAttribute, setDeletingAttribute] = useState();
  const [addingAttribute, setAddingAttribute] = useState();
  const [editingAttribute, setEditingAttribute] = useState();

  return (
    <>
      <EuiPanel paddingSize="none" hasShadow={false} borderRadius="none">
        <AttributeTree
          data={data}
          open={open}
          setOpen={setOpen}
          setDeletingAttribute={setDeletingAttribute}
          setParentAttribute={setParentAttribute}
          setEditingAttribute={setEditingAttribute}
        />
        <EuiPanel paddingSize="m" hasShadow={false} color="transparent">
          <EuiButtonEmpty
            iconType="plusInCircleFilled"
            size="s"
            aria-label={t("addAttribute", { ns: "attribute" })}
            onClick={() => setAddingAttribute(true)}
          >
            {t("addAttribute", { ns: "attribute" })}
          </EuiButtonEmpty>
        </EuiPanel>
      </EuiPanel>
      {addingAttribute || parentAttribute ? <AddAttributeModal attribute={parentAttribute} onCancel={() => {
        setAddingAttribute(false);
        setParentAttribute(null);
      }} /> : null}
    {deletingAttribute ? <DeleteAttributeModal attribute={deletingAttribute} onCancel={() => setDeletingAttribute(null)}/> : null}
    {editingAttribute ? <EditAttributeModal attribute={editingAttribute} onCancel={() => setEditingAttribute(null)}/> : null}
    </>
  )
}
