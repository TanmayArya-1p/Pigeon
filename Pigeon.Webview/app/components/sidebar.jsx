import React, { use, useState , useEffect , useContext } from 'react';
import { NavLink } from 'react-router';
import pigeonLogo from './../../assets/pigeon.png';
import {DispatcherStatusContext } from './dispatcherStatusWorker';

export default function Sidebar() {
    //const [dispatcherStatus, setDispatcherStatus] = useRecoilState(dispatcherStatusAtom);
    //console.log(dispatcherStatusAtom , useRecoilState(dispatcherStatusAtom))
    const dispatcherStatus = useContext(DispatcherStatusContext);
    

    let authHeader = new Headers()
    authHeader.append('Content-Type', 'application/json')
    authHeader.append('Authorization', 'nil')
    function toggleRunningStatus() {
        console.log("TRIED TO TOGGLE")
        if(dispatcherStatus.running){
            fetch("http://localhost:8000/stop"  , {headers: authHeader}).then((r) => r.json().then((a)=>{console.log("Starter Response ",a)}))
        }
        else{
            fetch("http://localhost:8000/start?interval=5"  , {headers: authHeader}).then((r) => r.json().then((a)=>{console.log("Starter Response ",a)}))
        }
    }
    return (
    <>
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open sidebar</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>
                        <NavLink to="/" className="flex items-center p-2 text-sm font-semibold text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <img src={pigeonLogo} className="h-8 me-3" alt="Pigeon Logo" />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Pigeon Webview</span>
                        </NavLink>
                    </div>
                    <div className="border p-3 rounded-xl flex flex-row mb-1">
                        <div>Dispatcher</div>
                        <div className='ml-3 mr-3'>|</div>
                        <div className="flex-row"> 
                            {dispatcherStatus.running ? 
                            <div className="text-green-500 flex-row flex"><div className='w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full border'/> Running</div> : 
                            <div className="text-red-500 flex-row flex"><div className='w-2 h-2 mt-2 mr-2 bg-red-500 rounded-full border'/> Stopped</div>
                            }
                        </div>
                    </div>
                    <div>
                        {dispatcherStatus.running?<button type="button" className="ml-5 mt-1 flex items-center text-red-500 text-center bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={toggleRunningStatus}>▢ Stop</button>
                        :<button type="button" className="ml-5 mt-1 flex items-center text-green-500 text-center bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={toggleRunningStatus}>▷  Start</button>
                        }
                    </div>
                </div>
            </div>
        </nav>

        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                <ul className="space-y-2 mt-5 font-medium">
                    <li>
                    <NavLink
                        to="/"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >                        <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                        </svg>
                        <span className="ms-3">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                    <NavLink
                        to="/pending_orders"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                        </svg>

                        <span className="flex-1 ms-3 whitespace-nowrap">Pending Orders</span>
                        </NavLink>
                    </li>
                    <li>
                    <NavLink
                        to="/dispatch"
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                    >                        
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                        <span className="flex-1 ms-3 whitespace-nowrap">Dispatch</span>
                        </NavLink>
                    </li>


                </ul>
            </div>
        </aside>
    </>
  );
}