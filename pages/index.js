import { Heading, Page, Button, Card, DataTable } from "@shopify/polaris";
import { Query } from 'react-apollo';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

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
}`;

const Index = () => {
  const [fetchStoreDetails, { loading, error, data }] = useLazyQuery(CHECK_SHOP);
  

  return (
  <Page>
    <Heading>Shopify app with Node and React 🎉</Heading>
    
    <Button size="large" primary={true} onClick={fetchStoreDetails()}>Fetch Store Details.</Button>

    <div style={{marginTop: "15px"}}>
      <Card title="Online Store Details" sectioned >
        <div>
          
              {loading && (<div>Loading...</div>)}
              {error && (<div>Error :(</div>)}

              {data && data.shop && (

                <DataTable
                  columnContentTypes={[
                    'text',
                    'text',
                  ]}
                  headings={[
                    'Field',
                    'Value',
                  ]}
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
    </div>
  </Page>
  );
};

export default Index;
