import { useEffect, useState } from "react";
import {useLocation} from "react-router";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import React from "react";
import { BadgeCheck, CircleAlert, Info, TriangleAlert } from 'lucide-react';


export function meta({}) {
    return [
      { title: "Pigeon/Dispatch" },
      { name: "description", content: "Dispatcher" },
    ];
}


export function DispatchChoiceTab() {
    const location = useLocation();
    return (
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="me-2">
                <a 
                    href="#single" 
                    className={`inline-block px-4 py-3 rounded-lg ${location.hash === "#single" ? "text-white bg-blue-600" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`} 
                    aria-current={location.hash === "#single" ? "page" : undefined}
                >
                    Single Target
                </a>
            </li>
            <li className="me-2">
                <a 
                    href="#campaign" 
                    className={`inline-block px-4 py-3 rounded-lg ${location.hash === "#campaign" ? "text-white bg-blue-600" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`} 
                    aria-current={location.hash === "#campaign" ? "page" : undefined}
                >
                    Campaign
                </a>
            </li>
        </ul>
        
    );
}




function SingleTargetDispatch(props) {
    const [target , setTarget] = useState("")
    const [title , setTitle] = useState("")
    const [body , setBody] = useState("")
    const [scheduledAt , setScheduledAt] = useState("")
    //TODO: PREVIEW ENGINE

    function submitDispatch() {
        let data = JSON.stringify({
        "scheduled_at": parseInt(scheduledAt),
        "message": {
            "to": target,
            "body": body,
            "title": title
        }
        });

        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8000/dispatch',
        headers: { 
            'Authorization': 'nil', 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            //TODO: CREATE ALERTS
            toast.success("Successfully Pushed Order")
        })
        .catch((error) => {
            console.log(error);
            toast.error(`Error in Pushing Order: ${error}`)
        });

    }


    return <div className="mt-10 w-[60%]">
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scheduled At</label>
            <input type="text" id="scheduled_at" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} placeholder="Epoch Unix Time" required />
        </div>
        <div className="mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Target</label>
            <input type="text" id="target" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="ExponentPushToken[xxxxxxx]" required />
        </div>
        <div className="mt-5 flex-row flex">
            <textarea id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification Title" required />
      
            <textarea id="body" className="bg-gray-50 ml-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Notification Body" required />
        </div>  
        <button onClick={submitDispatch} className="mt-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Dispatch
            </span>
        </button>
    </div>
}


function CampaignDispatch(props) {
    const [target , setTarget] = useState("")
    const [title , setTitle] = useState("")
    const [body , setBody] = useState("")
    const [scheduledAt , setScheduledAt] = useState("")

    function submitDispatch() {
        let data = JSON.stringify({
        "scheduled_at": parseInt(scheduledAt),
        "to": target.trim().split(","),
        "message": {
            "to": target,
            "body": body,
            "title": title
        }
        });

        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8000/campaign',
        headers: { 
            'Authorization': 'nil', 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            toast.success("Successfully Pushed Order")
        })
        .catch((error) => {
            console.log(error);
            toast.error(`Error in pushing order: ${error}`)
        });

    }


    return <div className="mt-10 w-[60%]">
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scheduled At</label>
            <input type="text" id="scheduled_at" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} placeholder="Epoch Unix Time" required />
        </div>
        <div className="mt-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Targets</label>
            <input type="text" id="target" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="ExponentPushToken[x],ExponentPushToken[x]...(comma separated)" required />
        </div>
        <div className="mt-5 flex-row flex w-[100%]">
            <textarea id="title" className="bg-gray-50 border w-[40%] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification Title" required />
      
            <textarea id="body" className="bg-gray-50 ml-5 border w-[40%]  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Notification Body" required />
        </div>  
        <button onClick={submitDispatch} className="mt-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Dispatch
            </span>
            
        </button>   
        <button onClick={()=>toast.info("fafw")} className="mt-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Dispatch
            </span>
            
        </button>   
    </div>
}

export default function DispatchPage(props) {

    const location = useLocation();

    useEffect(() => {
        window.location.hash = location.hash || "#single";
    },[])

    return <>
    <div className="flex-1 w-full h-full mb-20">
      <div className="flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ">
            <DispatchChoiceTab/>
            {location.hash == "#single" ? <SingleTargetDispatch/> : <CampaignDispatch/>}
      </div>
      <div className="h-10"></div>
    </div>
    <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        icon={({ type, theme }) => {
            switch (type) {
              case 'info':
                return <Info className="stroke-indigo-400" />;
              case 'error':
                return <CircleAlert className="stroke-red-500" />;
              case 'success':
                return <BadgeCheck className="stroke-green-500" />;
              case 'warning':
                return <TriangleAlert className="stroke-yellow-500" />;
              default:
                return null;
            }
          }}
    />

    </>
}