import { EuiPageSidebar, EuiCollapsibleNavGroup, EuiListGroup } from "@elastic/eui";
import { useTranslation } from "react-i18next";
import { CustomListGroupItem } from "../core/custom-list-group-item.jsx";

export function VerticalNav() {
  const { t } = useTranslation();
  return (
    <EuiPageSidebar paddingSize="s">
      <EuiCollapsibleNavGroup title={t("postings", { ns: "posting" })} isCollapsible={true}>
        <EuiListGroup gutterSize="none" size="s">
          <CustomListGroupItem href="/postings" id="postings" label={t("list", { ns: "common" })} />
          <CustomListGroupItem href="/categories" id="categories" label={t("categories", { ns: "posting" })} />
          <CustomListGroupItem href="/attributes" id="attributes" label={t("attributes", { ns: "posting" })} />
        </EuiListGroup>
      </EuiCollapsibleNavGroup>
      <EuiCollapsibleNavGroup title={t("title", { ns: "shipping" })} isCollapsible={true}>
        <EuiListGroup gutterSize="none" size="s">
          <CustomListGroupItem href="/shipping-services" id="shipping-services" label={t("services", { ns: "shipping" })} />
        </EuiListGroup>
      </EuiCollapsibleNavGroup>
    </EuiPageSidebar>
  )
}
