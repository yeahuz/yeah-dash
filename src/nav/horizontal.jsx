import { EuiHeader, EuiHeaderSectionItem } from "@elastic/eui";
import { CustomLink } from "../core/custom-link.jsx";
import { UserMenu } from "./user-menu.jsx";


export function HorizontalNav() {
  return (
    <EuiHeader>
      <EuiHeaderSectionItem border="right">
        <CustomLink color="text" href="/">Dash</CustomLink>
      </EuiHeaderSectionItem>
      <EuiHeaderSectionItem>
        <UserMenu />
      </EuiHeaderSectionItem>
    </EuiHeader>
  )
}
