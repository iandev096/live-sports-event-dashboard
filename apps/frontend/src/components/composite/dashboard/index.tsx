import { useMediaQuery } from "@uidotdev/usehooks";
import DesktopView from "./desktop";
import MobileView from "./mobile";

function Dashboard() {
  const isNotDesktop = useMediaQuery("(max-width: 1024px)");

  if (isNotDesktop) {
    return <MobileView />;
  }

  return <DesktopView />;
}

export default Dashboard;
