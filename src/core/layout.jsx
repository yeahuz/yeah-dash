import { HorizontalNav } from "../nav/horizontal";
import { Page } from "@geist-ui/core";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <Page>
      <Page.Header>
        <HorizontalNav />
      </Page.Header>
      <Page.Content>
        <Outlet />
      </Page.Content>
    </Page>
  )
}
