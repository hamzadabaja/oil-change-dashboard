// app/routes/app._index.jsx
import {
  Page,
  Layout,
  Card,
  Tabs,
  Text,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function AdminDashboardIndex() {
  const [selected, setSelected] = useState(0);

  const tabs = [
    {
      id: 'inventory',
      content: 'Inventory',
      panelID: 'inventory-content',
    },
    {
      id: 'service',
      content: 'Service',
      panelID: 'service-content',
    },
    {
      id: 'invoices',
      content: 'Invoices',
      panelID: 'invoices-content',
    },
    {
      id: 'pricing',
      content: 'Service Pricing',
      panelID: 'pricing-content',
    },
    {
      id: 'wholesale',
      content: 'Wholesale',
      panelID: 'wholesale-content',
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex), []);

  const renderContent = () => {
    switch (selected) {
      case 0:
        return <Text variant="bodyMd">Inventory section (view/edit parts).</Text>;
      case 1:
        return <Text variant="bodyMd">Service records and vehicle entries.</Text>;
      case 2:
        return <Text variant="bodyMd">Customer Invoices shown here.</Text>;
      case 3:
        return <Text variant="bodyMd">Service Pricing configuration.</Text>;
      case 4:
        return <Text variant="bodyMd">Wholesale Invoice history and uploads.</Text>;
      default:
        return null;
    }
  };

  return (
    <Page title="Oil Change Dashboard (Admin)">
      <Layout>
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Card.Section>
                {renderContent()}
              </Card.Section>
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
