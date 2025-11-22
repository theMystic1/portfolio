import { fetchOverview } from "@/backend/lib/apii";
import AdminOverviewPage from "@/components/admin/overview/overview";

const Overview = async () => {
  const overView = await fetchOverview();
  return <AdminOverviewPage overview={overView} />;
};

export default Overview;
