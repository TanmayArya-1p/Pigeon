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
    <div className = "display-flex flex-row w-[60%] ml-40">

      <div className="text-4xl mb-6 ">Pending Orders</div>
      <PendingOrdersList />  
    </div>
      </>
}
