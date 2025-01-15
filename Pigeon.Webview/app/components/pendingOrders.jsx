import {DispatcherStatusContext } from './dispatcherStatusWorker';

import React, { useContext } from 'react';

export default function PendingOrdersList({Iscollapsible}) {
    const dispatcherStatus = useContext(DispatcherStatusContext);

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
                {dispatcherStatus.pending_orders.slice(0,20).map((order, index) => {
                    console.log("Mapping " , order , Array.isArray(dispatcherStatus.pending_orders))
                    return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={index}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                            {index}
                        </th>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                            {order.message.to}
                        </th>
                        <td className="px-6 py-4 text-center">
                            {Date(order.scheduled_at)}
                        </td>
                        <td className="px-6 py-4 text-center">
                            
                            {order.message.body.length > 10 ?  order.message.body.slice(0, 10) + "..." : order.message.body}
                        </td>
                        <td className="px-6 py-4 text-center">
                            {order.message.title.length > 10 ?  order.message.title.slice(0, 10) + "..." : order.message.title}
                        </td>
                    </tr>
                })}
                {dispatcherStatus.pending_orders > 20 ? <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"></tr> : <></>}
            </tbody>
        </table>
    </div>
    </>
    
}