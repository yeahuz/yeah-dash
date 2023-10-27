import { Filters } from "./filters.jsx";
import { useState } from "preact/hooks";
import { getMany, updateOne } from "../api/listing.js";
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
import { DeleteListingModal } from "./delete-listing-modal.jsx";
import { IndexListingModal } from "./index-listing-modal.jsx";
import { Pagination } from "./pagination.jsx";

export function Listings() {
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState({ status_id: " ", cursor: "", direction: "", limit: 10 });
  const { data: listings } = useQuery({ queryKey: ["listings", query], queryFn: () => getMany(query) })
  const [listingsMap, setListingsMap] = useState({});
  const [deletingListing, setDeletingListing] = useState();
  const [indexingListing, setIndexingListing] = useState();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggleDetails = (item) => {
    const copy = { ...listingsMap };
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

    setListingsMap(copy);
  }

  const onPaginate = ({ direction, cursor, rowSize }) => {
    setQuery((prev) => ({ ...prev, direction, cursor, limit: rowSize }));
  }

  const mutation = useMutation({
    mutationFn: ({ id, update }) => updateOne(id, update),
    onMutate: async ({ id, update }) => {
      await queryClient.cancelQueries({ queryKey: ["listings", query] })
      const previous = queryClient.getQueryData(["listings", query])
      const listing = previous.list.find((item) => item.id === id);
      queryClient.setQueryData(["listings", query], (prev) => ({ ...prev, list: prev.list.map((item) => item.id === id ? Object.assign(item, update) : item) }))

      return { listing }
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(["listings", query], (prev) => ({ ...prev, list: prev.list.map((item) => item.id === context.listing.id ? context.listing : item) }))
    }
  })

  const columns = [
    {
      name: t("title", { ns: "listing" }),
      render: (data) => <EuiLink href={data.url} target="_blank">{data.title}</EuiLink>
    },
    {
      name: t("price", { ns: "listing" }),
      field: "price",
      render: (price) => t("priceDisplay", { price: Number(price).toLocaleString(i18n.language), ns: "listing" })
    },
    {
      name: t("location", { ns: "listing" }),
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
          name: <span>{t("index", { ns: "listing" })}</span>,
          description: t("index", { ns: "listing" }),
          onClick: setIndexingListing,
          isPrimary: true,
          icon: "indexOpen",
          type: "icon"
        },
        {
          name: <span>{t("delete", { ns: "common" })}</span>,
          description: t("delete", { ns: "common" }),
          onClick: setDeletingListing,
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
        <EuiButtonIcon onCLick={() => toggleDetails(item)} iconType={listingsMap[item.id] ? "arrowDown" : "arrowRight"}></EuiButtonIcon>
      )
    }
  ];

  return (
    <>
      <Filters setQuery={setQuery} query={query} />
      <EuiSpacer size="m" />
      <EuiBasicTable
        items={listings?.list || []}
        columns={columns}
        hasActions={true}
        isExpandable={true}
        itemId="id"
        itemIdToExpandedRowMap={listingsMap}
        noItemsMessage={t("noListings", { ns: "listing" })}
      />
      <EuiSpacer size="m" />
      <Pagination rows={[10, 20, 30]} pageSize={10} data={listings} onChange={onPaginate} />
      {deletingListing ? <DeleteListingModal onCancel={() => setDeletingListing(null)} /> : null}
      {indexingListing ? <IndexListingModal listing={indexingListing} onCancel={() => setIndexingListing(null)} /> : null}
    </>
  )

  // return (
  //   <Grid.Container direction="column" gap={2}>
  //     <Grid>
  //       <Filters setQuery={setQuery} />
  //     </Grid>
  //     <Grid>
  //       <Table data={listings?.list || []}>
  //         <Table.Column prop="title" label={t("title", { ns: "listing" })} render={(title, data) => <Link color underline href={data.url} target="_blank">{title}</Link>} />
  //         <Table.Column prop="price" label={t("price", { ns: "listing" })} render={(price) => t("priceDisplay", { price: Number(price).toLocaleString(i18n.language), ns: "listing" })} />
  //         <Table.Column prop="location" label={t("location", { ns: "listing" })} render={location => location.formatted_address}></Table.Column>
  //         <Table.Column prop="status" label={t("status", { ns: "common" })}
  //           render={(status) => <Badge style={{ backgroundColor: status.bg_hex, color: status.fg_hex }}>{status.translation.name}</Badge>}>
  //         </Table.Column>
  //         <Table.Column prop="created_at" label={t("createdAt", { ns: "common" })} render={(date) => new Date(date).toLocaleString(i18n.language)}></Table.Column>
  //         <Table.Column prop="id" label={t("actions", { ns: "common" })} render={(id, listing) => (<ButtonDropdown auto scale={2 / 3} type={listing.status.code === "active" ? 'error' : 'default'}>
  //           {listing.status.code === "in_moderation" ? (
  //             <ButtonDropdown.Item main onClick={() => mutation.mutate({ id, update: { status_id: 4 } })}>{t("index", { ns: "listing" })}</ButtonDropdown.Item>
  //           ) : null}
  //           <ButtonDropdown.Item main={listing.status.code === "indexing"}>{t("changeStatus", { ns: "listing" })}</ButtonDropdown.Item>
  //           <ButtonDropdown.Item type="error" main={listing.status.code === "active"}>{t("delete", { ns: "common" })}</ButtonDropdown.Item>
  //         </ButtonDropdown>)}></Table.Column>
  //       </Table>
  //     </Grid>
  //     <Grid>
  //       <ButtonGroup scale={2 / 3}>
  //         <Button iconRight={<ChevronLeft />} scale={2 / 3} disabled={!listings?.has_prev} onClick={() => setQuery((prev) => ({ ...prev, before: listings?.list[0]?.id, after: "" }))}></Button>
  //         <Button iconRight={<ChevronRight />} scale={2 / 3} disabled={!listings?.has_next} onClick={() => setQuery((prev) => ({ ...prev, after: listings?.list[listings?.list?.length - 1]?.id, before: "" }))}></Button>
  //       </ButtonGroup>
  //     </Grid>
  //   </Grid.Container>
  // )
}
