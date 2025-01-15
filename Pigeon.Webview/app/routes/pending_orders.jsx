import { Outlet } from "react-router";
import PendingOrdersList from "../components/pendingOrders";

export default function PendingOrders() {
  return (
    <div className="flex-1 w-full h-full mb-20">
      <div className="flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ">
          <div className="text-4xl mb-6">Pending Orders</div>
          <PendingOrdersList limit={-1} />
      </div>
      <div className="h-10"></div>
    </div>
  );
}