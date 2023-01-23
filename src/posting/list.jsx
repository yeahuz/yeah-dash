import { Filters } from "./filters.jsx";
import { useState } from "preact/hooks";
import { getMany, updateOne } from "../api/posting.js";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  EuiBasicTable,
  EuiLink,
  EuiBadge,
  EuiButtonIcon,
  EuiText,
  EuiSpacer,
} from "@elastic/eui";
import { DeletePostingModal } from "./delete-posting-modal.jsx";
import { IndexPostingModal } from "./index-posting-modal.jsx";
import { Pagination } from "./pagination.jsx";

export function Postings() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState({ status_id: " ", cursor: "", direction: "", limit: 10 });
  const { data: postings } = useQuery({ queryKey: ["postings", query], queryFn: () => getMany(query) })
  const [postingsMap, setPostingsMap] = useState({});
  const [deletingPosting, setDeletingPosting] = useState();
  const [indexingPosting, setIndexingPosting] = useState();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggleDetails = (item) => {
    const copy = { ...postingsMap };
    if (copy[item.id]) {
      delete copy[item.id]
    } else {
      copy[item.id] = (
        <EuiText grow={false}>
          <p>
            {item.description}
          </p>
        </EuiText>
      )
    }

    setPostingsMap(copy);
  }

  const onPaginate = ({ direction, cursor, rowSize }) => {
    setQuery((prev) => ({ ...prev, direction, cursor, limit: rowSize }));
  }

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

  const columns = [
    {
      name: t("title", { ns: "posting" }),
      render: (data) => <EuiLink href={data.url} target="_blank">{data.title}</EuiLink>
    },
    {
      name: t("price", { ns: "posting" }),
      field: "price",
      render: (price) => t("priceDisplay", { price: Number(price).toLocaleString(i18n.language), ns: "posting" })
    },
    {
      name: t("location", { ns: "posting" }),
      field: "location.formatted_address"
    },
    {
      name: t("status", { ns: "common" }),
      field: "status",
      render: (status) => <EuiBadge color={status.fg_hex}>{status.name}</EuiBadge>
    },
    {
      name: t("createdAt", { ns: "common" }),
      field: "created_at",
      render: (date) => new Date(date).toLocaleString(i18n.language)
    },
    {
      name: t("actions", { ns: "common" }),
      actions: [
        {
          name: <span>{t("index", { ns: "posting" })}</span>,
          description: t("index", { ns: "posting" }),
          onClick: setIndexingPosting,
          isPrimary: true,
          icon: "indexOpen",
          type: "icon"
        },
        {
          name: <span>{t("delete", { ns: "common" })}</span>,
          description: t("delete", { ns: "common" }),
          onClick: setDeletingPosting,
          isPrimary: true,
          icon: "trash",
          color: "danger",
          type: "icon"
        }
      ]
    },
    {
      align: "right",
      width: "40px",
      isExpander: true,
      render: (item) => (
        <EuiButtonIcon onCLick={() => toggleDetails(item)} iconType={postingsMap[item.id] ? "arrowDown" : "arrowRight"}></EuiButtonIcon>
      )
    }
  ];

  return (
    <>
      <Filters setQuery={setQuery} query={query} />
      <EuiSpacer size="m" />
      <EuiBasicTable items={postings?.list || []} columns={columns} hasActions={true} isExpandable={true} itemId="id" itemIdToExpandedRowMap={postingsMap} />
      <EuiSpacer size="m"/>
      <Pagination rows={[10, 20, 30]} pageSize={10} data={postings} onChange={onPaginate} />
      {deletingPosting ? <DeletePostingModal onCancel={() => setDeletingPosting(null) } /> : null}
      {indexingPosting ? <IndexPostingModal onCancel={() => setIndexingPosting(null)} /> : null}
    </>
  )

  // return (
  //   <Grid.Container direction="column" gap={2}>
  //     <Grid>
  //       <Filters setQuery={setQuery} />
  //     </Grid>
  //     <Grid>
  //       <Table data={postings?.list || []}>
  //         <Table.Column prop="title" label={t("title", { ns: "posting" })} render={(title, data) => <Link color underline href={data.url} target="_blank">{title}</Link>} />
  //         <Table.Column prop="price" label={t("price", { ns: "posting" })} render={(price) => t("priceDisplay", { price: Number(price).toLocaleString(i18n.language), ns: "posting" })} />
  //         <Table.Column prop="location" label={t("location", { ns: "posting" })} render={location => location.formatted_address}></Table.Column>
  //         <Table.Column prop="status" label={t("status", { ns: "common" })}
  //           render={(status) => <Badge style={{ backgroundColor: status.bg_hex, color: status.fg_hex }}>{status.translation.name}</Badge>}>
  //         </Table.Column>
  //         <Table.Column prop="created_at" label={t("createdAt", { ns: "common" })} render={(date) => new Date(date).toLocaleString(i18n.language)}></Table.Column>
  //         <Table.Column prop="id" label={t("actions", { ns: "common" })} render={(id, posting) => (<ButtonDropdown auto scale={2 / 3} type={posting.status.code === "active" ? 'error' : 'default'}>
  //           {posting.status.code === "in_moderation" ? (
  //             <ButtonDropdown.Item main onClick={() => mutation.mutate({ id, update: { status_id: 4 } })}>{t("index", { ns: "posting" })}</ButtonDropdown.Item>
  //           ) : null}
  //           <ButtonDropdown.Item main={posting.status.code === "indexing"}>{t("changeStatus", { ns: "posting" })}</ButtonDropdown.Item>
  //           <ButtonDropdown.Item type="error" main={posting.status.code === "active"}>{t("delete", { ns: "common" })}</ButtonDropdown.Item>
  //         </ButtonDropdown>)}></Table.Column>
  //       </Table>
  //     </Grid>
  //     <Grid>
  //       <ButtonGroup scale={2 / 3}>
  //         <Button iconRight={<ChevronLeft />} scale={2 / 3} disabled={!postings?.has_prev} onClick={() => setQuery((prev) => ({ ...prev, before: postings?.list[0]?.id, after: "" }))}></Button>
  //         <Button iconRight={<ChevronRight />} scale={2 / 3} disabled={!postings?.has_next} onClick={() => setQuery((prev) => ({ ...prev, after: postings?.list[postings?.list?.length - 1]?.id, before: "" }))}></Button>
  //       </ButtonGroup>
  //     </Grid>
  //   </Grid.Container>
  // )
}
