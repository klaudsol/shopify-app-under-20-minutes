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
  Frame,
  Spinner,
  Banner,
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
        title
        description
        onlineStorePreviewUrl
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

//Force redeploy, this time with ENV variables
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
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productNameError, setProductNameError] = useState("");
  const [productDescriptionError, setProductDescriptionError] = useState("");

  const onClickShowQuery = useCallback(() => {
    if (!data) {
      fetchStoreDetails();
    }
    setShowQuery((x) => !x);
  }, [data]);

  const onClickShowMutation = useCallback(() => {
    setShowMutation((x) => !x);
  }, []);

  const onSubmitMutation = useCallback(async () => {
    if (productName && productDescription) {
      await createProduct({
        variables: {
          input: {
            title: productName,
            descriptionHtml: productDescription,
          },
        },
      });

      setProductNameError("");
      setProductDescriptionError("");
      setShowSuccessBanner(true);
    } else {
      if (!productName) {
        setProductNameError("Product name is required");
      } else {
        setProductNameError("");
      }

      if (!productDescription) {
        setProductDescriptionError("Product description is required");
      } else {
        setProductDescriptionError("");
      }
    }
  }, [productName, productDescription]);

  return (
    <Frame>
      <Page>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <FormLayout>
                <Heading>Shopify app with Node and React 🎉</Heading>
                <Button size="large" primary={true} onClick={onClickShowQuery}>
                  {showQuery ? "Hide" : "Show"} Graphql Admin API Query Example
                </Button>
                <Button
                  size="large"
                  primary={true}
                  onClick={onClickShowMutation}
                >
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
                  {loading && (
                    <Spinner
                      accessibilityLabel="Spinner example"
                      size="small"
                      color="teal"
                    />
                  )}
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
                    {createProductData && showSuccessBanner && (
                      <Banner
                        title={`Product “${createProductData.productCreate.product.title}” successfully created.`}
                        status="success"
                        action={{
                          content: "Preview product page",
                          external: true,
                          url:
                            createProductData.productCreate.product
                              .onlineStorePreviewUrl,
                        }}
                        onDismiss={() => {
                          setShowSuccessBanner(false);
                        }}
                      />
                    )}
                    <TextField
                      label="Product Name"
                      onChange={(x) => setProductName(x)}
                      value={productName}
                      error={productNameError}
                    />
                    <TextField
                      label="Product Description"
                      onChange={(x) => setProductDescription(x)}
                      multiline={10}
                      value={productDescription}
                      error={productDescriptionError}
                    />
                    <Button submit primary size="large">
                      Create Product{" "}
                      {createProductLoading && (
                        <Spinner
                          accessibilityLabel="Spinner example"
                          size="large"
                          color="white"
                        />
                      )}
                    </Button>
                  </FormLayout>
                </Form>
              </Card>
            )}
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
};

export default Index;
