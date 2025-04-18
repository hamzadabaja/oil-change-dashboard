// app/routes/api.inventory.js
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);
  const session = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      {
        metaobjects(type: "customer_inventory", first: 100) {
          edges {
            node {
              id
              fields {
                key
                value
              }
            }
          }
        }
      }
    `
  );

  const data = await response.json();
  const inventory = data.data.metaobjects.edges
    .map((edge) => {
      const obj = {};
      edge.node.fields.forEach((f) => {
        obj[f.key] = f.value;
      });
      return obj;
    })
    .filter((item) => item.customer_id === session.session.id);

  return json(inventory);
}
