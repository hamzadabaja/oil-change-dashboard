import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // You could add cleanup logic here later (e.g., delete metaobjects tied to this shop)

  return new Response();
};
