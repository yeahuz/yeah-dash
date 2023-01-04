import { Grid, Select } from "@geist-ui/core";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getFilters } from "../api/posting.js";

export function Filters({ setQuery }) {
  const { t } = useTranslation();
  const { data: filters } = useQuery({ queryKey: ["filters"], queryFn: () => getFilters(), staleTime: Infinity })

  return (
    <Grid.Container direction="column">
      <Grid>
        <Select onChange={(status) => setQuery((prev) => ({ ...prev, status_id: status }))} placeholder={t("chooseStatus", { ns: "posting" })} clearable={true}>
          <Select.Option value="">{t("all", { ns: "common" })}</Select.Option>
          {filters?.statuses.map((status) => (
            <Select.Option value={String(status.id)}>{status.name}</Select.Option>
          ))}
        </Select>
      </Grid>
    </Grid.Container>
  )
}
