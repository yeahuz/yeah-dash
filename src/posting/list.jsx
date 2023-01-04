import { Grid, Table, Link, Badge, ButtonGroup, Button, ButtonDropdown } from "@geist-ui/core";
import { Filters } from "./filters.jsx";
import { useState } from "preact/hooks";
import { getMany, updateOne } from "../api/posting.js";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "@geist-ui/icons";
import { ChevronLeft } from "@geist-ui/icons";
import { useQueryClient } from "@tanstack/react-query";

export function Postings() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState({ status_id: "", before: "", after: "" });
  const { data: postings } = useQuery({ queryKey: ["postings", query], queryFn: () => getMany(query) })

  const mutation = useMutation({
    mutationFn: ({ id, update }) => updateOne(id, update),
    onMutate: async ({ id, update }) => {
      await queryClient.cancelQueries({ queryKey: ["postings", query] })
      const previous = queryClient.getQueryData(["postings", query])
      const posting = previous.list.find((item) => item.id === id);
      queryClient.setQueryData(["postings", query], (prev) => ({ ...prev, list: prev.list.map((item) => item.id === id ? Object.assign(item, update) : item) }))

      return { posting }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["postings", query], (prev) => ({ ...prev, list: prev.list.map((item) => item.id === context.posting.id ? context.posting : item) }))
    }
  })

  return (
    <Grid.Container direction="column" gap={2}>
      <Grid>
        <Filters setQuery={setQuery} />
      </Grid>
      <Grid>
        <Table data={postings?.list || []}>
          <Table.Column prop="title" label={t("title", { ns: "posting" })} render={(title, data) => <Link color underline href={data.url} target="_blank">{title}</Link>} />
          <Table.Column prop="price" label={t("price", { ns: "posting" })} render={(price) => t("priceDisplay", { price: Number(price).toLocaleString(i18n.language), ns: "posting" })} />
          <Table.Column prop="location" label={t("location", { ns: "posting" })} render={location => location.formatted_address}></Table.Column>
          <Table.Column prop="status" label={t("status", { ns: "common" })}
            render={(status) => <Badge style={{ backgroundColor: status.bg_hex, color: status.fg_hex }}>{status.translation.name}</Badge>}>
          </Table.Column>
          <Table.Column prop="created_at" label={t("createdAt", { ns: "common" })} render={(date) => new Date(date).toLocaleString(i18n.language)}></Table.Column>
          <Table.Column prop="id" label={t("actions", { ns: "common" })} render={(id, posting) => (<ButtonDropdown auto scale={2 / 3} type={posting.status.code === "active" ? 'error' : 'default'}>
            {posting.status.code === "in_moderation" ? (
              <ButtonDropdown.Item main onClick={() => mutation.mutate({ id, update: { status_id: 4 } })}>{t("index", { ns: "posting" })}</ButtonDropdown.Item>
            ) : null}
            <ButtonDropdown.Item main={posting.status.code === "indexing"}>{t("changeStatus", { ns: "posting" })}</ButtonDropdown.Item>
            <ButtonDropdown.Item type="error" main={posting.status.code === "active"}>{t("delete", { ns: "common" })}</ButtonDropdown.Item>
          </ButtonDropdown>)}></Table.Column>
        </Table>
      </Grid>
      <Grid>
        <ButtonGroup scale={2 / 3}>
          <Button iconRight={<ChevronLeft />} scale={2 / 3} disabled={!postings?.has_prev} onClick={() => setQuery((prev) => ({ ...prev, before: postings?.list[0]?.id, after: "" }))}></Button>
          <Button iconRight={<ChevronRight />} scale={2 / 3} disabled={!postings?.has_next} onClick={() => setQuery((prev) => ({ ...prev, after: postings?.list[postings?.list?.length - 1]?.id, before: "" }))}></Button>
        </ButtonGroup>
      </Grid>
    </Grid.Container>
  )
}
