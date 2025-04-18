// app/routes/app.inventory.jsx
import {
  Page,
  Card,
  TextField,
  Button,
  Layout,
  FormLayout,
  ResourceList,
  Text,
} from "@shopify/polaris";
import { useState } from "react";
import { json, useLoaderData, useFetcher } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const response = await admin.graphql(`
    {
      metaobjects(type: "customer_inventory", first: 100) {
        nodes {
          id
          fields {
            key
            value
          }
        }
      }
    }
  `);

  const raw = await response.json();

  const inventory = raw.data.metaobjects.nodes.map((obj) => {
    const item = {};
    obj.fields.forEach(({ key, value }) => {
      item[key] = value;
    });
    item.id = obj.id;
    return item;
  });

  return json(inventory);
};

const productDatabase = {
  "COF2500": "https://choicewholesalellc.com/products/cof2500",
  "CAF99850": "https://choicewholesalellc.com/products/caf99850",
  "CCF99806": "https://choicewholesalellc.com/products/ccf99806",
  // Add more as needed
};

function normalizePartNumber(input) {
  return input.replace(/\s+/g, "").toUpperCase();
}

export default function InventoryTab() {
  const inventory = useLoaderData();
  const fetcher = useFetcher();

  const [form, setForm] = useState({
    part_number: "",
    part_name: "",
    quantity: 1,
    wholesale_price: "",
    retail_price: "",
    product_url: "",
  });

  const handleChange = (field) => (value) => {
    let updated = { ...form, [field]: value };

    if (field === "part_number") {
      const normalized = normalizePartNumber(value);
      if (productDatabase[normalized]) {
        updated.product_url = productDatabase[normalized];
      }
    }

    setForm(updated);
  };

  const handleSubmit = () => {
    fetcher.submit(form, {
      method: "post",
      action: "/api/create-inventory",
    });
    setForm({
      part_number: "",
      part_name: "",
      quantity: 1,
      wholesale_price: "",
      retail_price: "",
      product_url: "",
    });
  };

  return (
    <Page title="Inventory">
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <FormLayout>
              <TextField
                label="Part Number"
                value={form.part_number}
                onChange={handleChange("part_number")}
                autoComplete="off"
              />
              <TextField
                label="Part Name"
                value={form.part_name}
                onChange={handleChange("part_name")}
              />
              <TextField
                type="number"
                label="Quantity"
                value={form.quantity}
                onChange={handleChange("quantity")}
              />
              <TextField
                type="number"
                label="Wholesale Price"
                value={form.wholesale_price}
                onChange={handleChange("wholesale_price")}
              />
              <TextField
                type="number"
                label="Retail Price"
                value={form.retail_price}
                onChange={handleChange("retail_price")}
              />
              <TextField
                label="Product URL (optional)"
                value={form.product_url}
                onChange={handleChange("product_url")}
              />
              <Button onClick={handleSubmit} primary>
                Add to Inventory
              </Button>
            </FormLayout>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card title="Current Inventory" sectioned>
            <ResourceList
              resourceName={{ singular: "item", plural: "items" }}
              items={inventory}
              renderItem={(item) => {
                return (
                  <ResourceList.Item id={item.id}>
                    <Text variant="bodyMd" fontWeight="bold">
                      {item.part_number} – {item.part_name}
                    </Text>
                    <div>
                      Qty: {item.quantity}, Retail: ${item.retail_price}, Wholesale: ${item.wholesale_price}
                    </div>
                    {item.product_url && (
                      <div>
                        <a href={item.product_url} target="_blank" rel="noreferrer">
                          View Product
                        </a>
                      </div>
                    )}
                  </ResourceList.Item>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
