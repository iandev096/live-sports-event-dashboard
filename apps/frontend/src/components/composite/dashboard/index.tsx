import { useMediaQuery } from "@uidotdev/usehooks";
import DesktopView from "./desktop";
import MobileView from "./mobile";

function Dashboard() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return <MobileView />;
  }

  return <DesktopView />;
}

export default Dashboard;
