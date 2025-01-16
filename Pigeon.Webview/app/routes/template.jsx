import React, { useEffect  , useState} from "react"
import { useParams } from "react-router"
import axios from 'axios'
import { BadgeCheck, CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import TemplateViewer from "../components/templateViewer";

export default function TemplatePage() {
    let { id } = useParams();
    const [loading, setLoading] = useState(true)
    const [template,setTemplate] = useState()
    const [target , setTarget] = useState("")
    const [params , setParams] = useState({})


    const handleCopy = () => {
        navigator.clipboard.writeText(template.id).then(() => {
            toast.success(template.id+' copied to clipboard');
        }).catch(err => {
            toast.error('Failed to copy: ', err);
        });
    };


    async function fetchTemplate(tid){
        console.log("Fetching Template ", tid)
        let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:5000/schema/${tid}`,
        headers: { 
            'Authorization': 'nil', 
            'Content-Type': 'application/json'
        },
        };
        //TODO: ADD AUTH HERE AFTER FIX
        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            toast.success("Success Fetching Template");
            setTemplate(response.data)
            setLoading(false)
            response.data.params.forEach((a) => params[a] = "")

        })
        .catch((error) => {
            console.log(error);
            toast.error("Error Fetching Template: "+error);
            setTimeout(()=>window.location.href="/templates", 2000)
        });


    }

    useEffect(()=> {
        fetchTemplate(id)
    } , [])


    return <div className="flex-1 w-full h-full mb-20">
        <div className="flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ">
        {loading ? <div className="w-full mt-32 text-xl text-center text-gray-500">

            <div role="status" className="mt-30">
            <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
            </div>
        </div>
        :

            <div>
                <h1 className="font-sans text-6xl">{loading? null : (template.name.length > 25 ? template.name.slice(0,25) + "..." : template.name )}</h1>
                <div className="flex flex-row">
                    <p>{id}</p>
                    <button className="ml-2" onClick={handleCopy}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>
                    </button>
                </div>
                <div className="flex-row flex">
                    <div>
                        <div className="mt-10">
                            <TemplateViewer title="Notification Title" body={template.title}></TemplateViewer>
                        </div>
                        <div className="mt-10">
                            <TemplateViewer title="Notification Body" body={template.body}></TemplateViewer>
                        </div>

                    </div>
                    <div>
                        <div className="ml-20 mt-5 w-full">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Target</label>
                            <input type="text" id="target" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={name} onChange={(e) => setName(e.target.value)} placeholder="ExponentPushToken[xxx]" required />

                        </div>
                        {template.params && template.params.map((param, index) => (
                            <div key={index} className="ml-20 mt-5 w-full">
                                <label className="block mb-2 flex flex-row text-sm font-medium text-gray-900 dark:text-white font-mono">
                                    <svg xmlns="http://www.w3.org/2000/svg" data-tooltip-id="parameters" data-tooltip-content="Parameter" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.745 3A23.933 23.933 0 0 0 3 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402l2.402 7.206a.75.75 0 0 0 1.104.401l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09" />
                                    </svg>
                                    {param}</label>
                                <input
                                    type="text"
                                    id={param}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={params[param]}
                                    onChange={(e) => setParams({ ...params, [param]: e.target.value })}
                                    placeholder={`Enter ${param}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                </div>


            </div>
        }
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
        </div>
    </div> 
        
}