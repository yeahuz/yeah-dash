import {
  EuiButtonEmpty,
  EuiButtonIcon, EuiContextMenuItem, EuiContextMenuPanel, EuiFlexGroup,
  EuiFlexItem, EuiPanel, EuiPopover
} from "@elastic/eui";
import { useState } from "preact/hooks";
import { useTranslation } from "react-i18next";

export function Pagination({ rows = [], onChange, pageSize = 2, data }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [rowSize, setRowSize] = useState(pageSize);
  const [direction, setDirection] = useState();
  const [cursor, setCursor] = useState();
  const { t }  = useTranslation();

  const getIconType = (size) => size === rowSize ? "check" : "empty";
  const togglePopover = () => setPopoverOpen((prev) => !prev);

  const onRowSizeChange = (size) => {
    togglePopover();
    setRowSize(size)
    onChange({ direction, cursor, rowSize: size });
  }

  const onPaginate = (direction) => {
    const cursor = direction === "after" ? data?.list[data.list.length - 1].id : data.list[0].id;
    setDirection(direction);
    setCursor(cursor);
    onChange({ direction, cursor, rowSize });
  }

  const popoverBtn = (
    <EuiButtonEmpty
      iconSide="right"
      onClick={togglePopover}
      iconType="arrowDown"
      size="xs"
      color="text"
    >
      {t("rowsPerPage", { ns: "common", count: rowSize })}
    </EuiButtonEmpty>
  );

  const items = rows.map((size) => <EuiContextMenuItem key={t("rowsCount", { ns: "common", count: size })} icon={getIconType(size)} onClick={() => onRowSizeChange(size)}>{t("rowsCount", { ns: "common", count: size })}</EuiContextMenuItem>)

  return (
    <EuiPanel paddingSize="none" hasBorder={false} hasShadow={false} color="transparent">
      <EuiFlexGroup justifyContent="spaceBetween">
        <EuiFlexItem grow={false}>
          <EuiPopover anchorPosition="upCenter" panelPaddingSize="none" isOpen={popoverOpen} button={popoverBtn} closePopover={togglePopover}>
            <EuiContextMenuPanel size="s" items={items} />
          </EuiPopover>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFlexGroup gutterSize="s">
            <EuiButtonIcon disabled={!data?.has_prev} iconType="arrowLeft" color="text" onClick={() => onPaginate("before")}></EuiButtonIcon>
            <EuiButtonIcon disabled={!data?.has_next} iconType="arrowRight" color="text" onClick={() => onPaginate("after")}></EuiButtonIcon>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  )
}
