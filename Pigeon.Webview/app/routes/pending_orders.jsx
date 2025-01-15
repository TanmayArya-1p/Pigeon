import { Outlet } from "react-router";
import PendingOrdersList from "../components/pendingOrders";
import { useContext } from "react";
import { DispatcherStatusContext } from "../components/dispatcherStatusWorker";


export function meta({}) {
  return [
    { title: "Pigeon/Pending" },
    { name: "description", content: "Pending Orders" },
  ];
}


export default function PendingOrders() {
  const dispatherStatus = useContext(DispatcherStatusContext);
  return (
    <div className="flex-1 w-full h-full mb-20">
      <div className="flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ">
          <div className="text-4xl mb-6">Pending Orders</div>
          <PendingOrdersList limit={dispatherStatus.pending_orders.length} />
      </div>
      <div className="h-10"></div>
    </div>
  );
}