import { EuiBadge, EuiBasicTable, EuiFlexGroup, EuiFlexItem, EuiImage } from "@elastic/eui";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getServices } from "../../api/shipping.js";

export function ShippingServices() {
  let queryClient = useQueryClient();
  let { t } = useTranslation();

  let { data: services } = useQuery({ queryKey: ["shipping-services"], queryFn: getServices });
  let columns = [
    {
      name: t("serviceName", { ns: "shipping" }),
      render: (data) => (
        <EuiFlexGroup alignItems="center">
          <EuiImage src={data.logo_data_url} css={{ width: "64px" }}></EuiImage>
          <EuiFlexItem>
            {data.name}
          </EuiFlexItem>
        </EuiFlexGroup>
      )
    },
    {
      name: t("description", { ns: "common" }),
      field: "description"
    },
    {
      name: t("status", { ns: "common" }),
      field: "active",
      render: (active) => <EuiBadge color={active ? "#027A48" : "#B54708"}>{active ? t("active", { ns: "common" }) : t("inactive", { ns: "common" })}</EuiBadge>
    },
  ]

  return (
    <>
      <EuiBasicTable
        items={services?.list || []}
        columns={columns}
        hasActions={true}
        isExpandable={true}
        itemId="id"
        noItemsMessage={t("noServices", { ns: "shipping" })}
      />
    </>
  )
}
