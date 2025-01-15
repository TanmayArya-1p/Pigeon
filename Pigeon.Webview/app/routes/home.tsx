import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import PendingOrdersList from "../components/pendingOrders";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pigeon" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <>
  <div className="flex-1 w-full h-full">
    <div className="flex flex-col items-start w-[75%] ml-[20%] mt-[10%]">
        <div className="text-4xl mb-6">Pending Orders</div>
        <PendingOrdersList />
    </div>
  </div>
  </>
}
