// app/routes/api.inventory.js
import { authenticate } from "~/shopify.server";
import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);

  const customerId = session?.onlineAccessInfo?.associated_user?.id || session?.id;
  if (!customerId) {
    return json({ error: "Missing customer ID" }, { status: 400 });
  }

  const response = await admin.graphql(`
    {
      metaobjects(type: "customer_inventory", first: 100, query: "customer_id:'${customerId}'") {
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

  const jsonData = await response.json();

  const parsed = jsonData.data.metaobjects.nodes.map((node) => {
    const out = {};
    node.fields.forEach((field) => {
      out[field.key] = field.value;
    });
    out.id = node.id;
    return out;
  });

  return json(parsed);
};
