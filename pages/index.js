import {
  Heading,
  Page,
  Button,
  Card,
  DataTable,
  Layout,
} from "@shopify/polaris";
import { Query } from "react-apollo";
import { useLazyQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from "react";

const CHECK_SHOP = gql`
  query {
    shop {
      name
      primaryDomain {
        host
      }
      myshopifyDomain
      plan {
        displayName
      }
      timezoneAbbreviation
    }
  }
`;

const Index = () => {
  const [fetchStoreDetails, { loading, error, data }] = useLazyQuery(
    CHECK_SHOP
  );
  const [show, setShow] = useState(false);

  const clickMe = () => {
    if (!show) {
      fetchStoreDetails();
    }
    setShow((x) => !x);
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Heading>Shopify app with Node and React 🎉</Heading>
            <Button size="large" primary={true} onClick={() => clickMe()}>
              Graphql Admin API Query Example.
            </Button>
          </Card>
          {show && (
            <Card title="Graphql Admin API Query Example" sectioned>
              <div>
                {loading && <div>Loading...</div>}
                {error && <div>Error :(</div>}

                {data && data.shop && (
                  <DataTable
                    columnContentTypes={["text", "text"]}
                    headings={["Field", "Value"]}
                    rows={[
                      ["Name", data.shop.name],
                      ["Domain", data.shop.primaryDomain.host],
                      ["MyShopify Domain", data.shop.myshopifyDomain],
                      ["Plan", data.shop.plan.displayName],
                      ["Timezone", data.shop.timezoneAbbreviation],
                    ]}
                  />
                )}
              </div>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
