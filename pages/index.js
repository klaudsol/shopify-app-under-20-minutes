import {
  Heading,
  Page,
  Button,
  Card,
  DataTable,
  Layout,
  FormLayout,
  Form,
  TextField,
} from "@shopify/polaris";
import { Query } from "react-apollo";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState, useCallback } from "react";

const QUERY_SHOP = gql`
  query {
    shop {
      id
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

const CREATE_PRODUCT = gql`
  mutation productCreate($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
      }
      shop {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const Index = () => {
  const [fetchStoreDetails, { loading, error, data }] = useLazyQuery(
    QUERY_SHOP
  );
  const [
    createProduct,
    {
      loading: createProductLoading,
      error: createProductError,
      data: createProductData,
    },
  ] = useMutation(CREATE_PRODUCT);
  const [showQuery, setShowQuery] = useState(false);
  const [showMutation, setShowMutation] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const onClickShowQuery = useCallback(() => {
    if (!data) {
      fetchStoreDetails();
    }
    setShowQuery((x) => !x);
  }, [data]);

  const onClickShowMutation = useCallback(() => {
    setShowMutation((x) => !x);
  }, []);

  const onSubmitMutation = useCallback(() => {}, []);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <FormLayout>
              <Heading>Shopify app with Node and React 🎉</Heading>
              <Button size="large" primary={true} onClick={onClickShowQuery}>
                {showQuery ? "Hide" : "Show"} Graphql Admin API Query Example
              </Button>
              <Button size="large" primary={true} onClick={onClickShowMutation}>
                {showMutation ? "Hide" : "Show"} Graphql Admin API Mutation
                Example
              </Button>
            </FormLayout>
          </Card>
          {showQuery && (
            <Card
              title="Query Shop - Graphql Admin API Query Example"
              sectioned
            >
              <div>
                {loading && <div>Loading...</div>}
                {error && <div>Error :(</div>}

                {data && data.shop && (
                  <DataTable
                    columnContentTypes={["text", "text"]}
                    headings={["Field", "Value"]}
                    rows={[
                      ["ID", data.shop.id],
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
          {showMutation && (
            <Card
              title="Create Product - Graphql Admin API Mutation Example"
              sectioned
            >
              <Form onSubmit={onSubmitMutation}>
                <FormLayout>
                  <TextField
                    label="Product Name"
                    onChange={(x) => setProductName(x)}
                    value={productName}
                  />
                  <TextField
                    label="Product Description"
                    onChange={(x) => setProductDescription(x)}
                    multiline={10}
                    value={productDescription}
                  />
                  <Button submit primary>
                    Create Product
                  </Button>
                </FormLayout>
              </Form>
            </Card>
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Index;
