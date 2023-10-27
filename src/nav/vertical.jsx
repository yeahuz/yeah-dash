import { EuiPageSidebar, EuiCollapsibleNavGroup, EuiListGroup } from "@elastic/eui";
import { useTranslation } from "react-i18next";
import { CustomListGroupItem } from "../core/custom-list-group-item.jsx";

export function VerticalNav() {
  const { t } = useTranslation();
  return (
    <EuiPageSidebar paddingSize="s">
      <EuiCollapsibleNavGroup title={t("listings", { ns: "listing" })} isCollapsible={true}>
        <EuiListGroup gutterSize="none" size="s">
          <CustomListGroupItem href="/listings" id="listings" label={t("list", { ns: "common" })} />
          <CustomListGroupItem href="/categories" id="categories" label={t("categories", { ns: "listing" })} />
          <CustomListGroupItem href="/attributes" id="attributes" label={t("attributes", { ns: "listing" })} />
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
