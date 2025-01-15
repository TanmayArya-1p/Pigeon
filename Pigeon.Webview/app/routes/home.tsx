import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import PendingOrdersList from "../components/pendingOrders";
import React from "react";
import { DispatcherStatusContext } from "../components/dispatcherStatusWorker";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pigeon" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const dispatcherStatus = React.useContext(DispatcherStatusContext);


  return <>
  <div className="flex-1 w-full h-full">
    <div className="flex flex-row mt-[7%] ml-[20%]">
        <div>
          <a className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

          <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Served Orders</h5>
          <p className="text-2xl text-center text-gray-700 dark:text-gray-400">{dispatcherStatus.served}</p>
          </a>

        </div>
        <div>
          <a className="block ml-5 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

            <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Pending Orders</h5>
            <p className="text-2xl text-center text-gray-700 dark:text-gray-400">{dispatcherStatus.pending}</p>
          </a>
        </div>
        <div>
          <a className="block ml-5 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

            <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Deleted Tokens</h5>
            <p className="text-2xl text-center text-gray-700 dark:text-gray-400">{dispatcherStatus.deleted_tokens}</p>
          </a>
        </div>
    </div>
    <div className="flex flex-col items-start w-[75%] ml-[20%] mt-8">
        <div className="text-4xl mb-6">Pending Orders</div>
        <PendingOrdersList />
    </div>
  </div>
  </>
}
