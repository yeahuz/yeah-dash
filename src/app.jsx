import { HorizontalNav } from "./nav/horizontal";
import { Page, Text } from "@geist-ui/core";

export function App({ route }) {
  return (
    <Page>
      <Page.Header>
        <HorizontalNav />
      </Page.Header>
      <Page.Content>
        <Text>Hello world</Text>
      </Page.Content>
      <Page.Footer>
        <Text>Hello Footer</Text>
      </Page.Footer>
    </Page>
  )
}
