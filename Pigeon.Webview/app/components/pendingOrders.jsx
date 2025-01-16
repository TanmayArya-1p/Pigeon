import {DispatcherStatusContext } from './dispatcherStatusWorker';

import React, { useContext, useEffect } from 'react';

function formatDate(epochTime) {
    const date = new Date(epochTime * 1000);
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const dateOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const formattedTime = date.toLocaleString('en-US', timeOptions);
    const formattedDate = date.toLocaleString('en-US', dateOptions);
    return `${formattedTime} ${formattedDate}`;
}

export default function PendingOrdersList({Iscollapsible , limit =5}) {
    const dispatcherStatus = useContext(DispatcherStatusContext);   
    if(limit==-1) {
        limit = dispatcherStatus.pending_orders.length
    }
    return <>

    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3 text-center">
                        Queue
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        Target
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        Scheduled At
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        Body
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        Title
                    </th>
                </tr>
            </thead>
            <tbody>
                {dispatcherStatus.pending_orders.slice(0,limit).map((order, index) => {
                    console.log("Mapping " , order , Array.isArray(dispatcherStatus.pending_orders))
                    return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={index}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                            {index+1}
                        </th>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                            {order.message.to}
                        </th>
                        <td className="px-6 py-4 text-center">
                            {formatDate(order.scheduled_at)}
                        </td>
                        <td className="px-6 py-4 text-center">
                            
                            {order.message.body.length > 10 ?  order.message.body.slice(0, 10) + "..." : order.message.body}
                        </td>
                        <td className="px-6 py-4 text-center">
                            {order.message.title.length > 10 ?  order.message.title.slice(0, 10) + "..." : order.message.title}
                        </td>
                    </tr>
                })}
          {limit!=-1 && dispatcherStatus.pending_orders.length > limit && (
            <tr className="odd:bg-white rounded-md odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td colSpan="5" className=" text-center">
                <button
                  onClick={() => window.location.href = "/pending_orders"}
                  className="px-4 text-center py-2 w-full bg-inherit text-white rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50  hover:bg-gray-700"
                >
                  ...
                </button>
              </td>
            </tr>
          )}
            </tbody>
        </table>
        <div className="h-10"></div>
    </div>
    </>
    
}