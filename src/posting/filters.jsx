import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getFilters } from "../api/posting.js";
import { EuiHealth, EuiSuperSelect, EuiPanel } from "@elastic/eui";

export function Filters({ setQuery, query }) {
  const { t } = useTranslation();
  const { data: filters, isLoading } = useQuery({ queryKey: ["filters"], queryFn: () => getFilters(), staleTime: Infinity })


  const options = [
    {
      value: " ",
      inputDisplay: (
        <EuiHealth color="subdued">{t("all", { ns: "common" })}</EuiHealth>
      )
    },
  ].concat(
    filters?.statuses?.map((status) => ({
      value: String(status.id),
      inputDisplay: (
        <EuiHealth color={status.fg_hex}>{status.name}</EuiHealth>
      )
    }))
  )

  if (isLoading) return null;

  return (
    <EuiSuperSelect options={options} valueOfSelected={query.status_id} onChange={(status) => setQuery((prev) => ({...prev, status_id: status }))} />
    // <Grid.Container direction="column">
    //   <Grid>
    //     <Select onChange={(status) => setQuery((prev) => ({ ...prev, status_id: status }))} placeholder={t("chooseStatus", { ns: "posting" })} clearable={true}>
    //       <Select.Option value="">{t("all", { ns: "common" })}</Select.Option>
    //       {filters?.statuses.map((status) => (
    //         <Select.Option value={String(status.id)}>{status.name}</Select.Option>
    //       ))}
    //     </Select>
    //   </Grid>
    // </Grid.Container>
  )
}
