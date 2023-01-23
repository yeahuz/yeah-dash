import { HorizontalNav } from "../nav/horizontal.jsx";
import { VerticalNav } from "../nav/vertical.jsx";
import { EuiPage, EuiPageBody, EuiPageSection } from "@elastic/eui";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <>
      <HorizontalNav />
      <EuiPage>
        <VerticalNav />
        <EuiPageBody>
          <EuiPageSection paddingSize="l">
            <Outlet />
          </EuiPageSection>
        </EuiPageBody>
      </EuiPage>
    </>
  )
}
