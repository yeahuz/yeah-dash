import { Grid, Select } from "@geist-ui/core";
import { useEffect } from "preact/hooks";
import { useApi } from "../core/useApi.js";
import { getFilters } from "../api/posting.js";
import { useTranslation } from "react-i18next";

export function Filters() {
  const { t } = useTranslation();
  const { run, isLoading, data } = useApi();

  useEffect(() => {
    run(getFilters()).catch(() => {});
  }, [])

  return (
    <Grid.Container direction="column">
      <Grid>
        <Select placeholder={t("chooseStatus", { ns: "posting" })} clearable={true}>
          <Select.Option value=" ">{t("all", { ns: "common" })}</Select.Option>
          {data?.statuses.map((status) => (
            <Select.Option value={String(status.id)}>{status.name}</Select.Option>
          ))}
        </Select>
      </Grid>
    </Grid.Container>
  )
}
