import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import TemplateEditor from '../components/templateEditor';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import { BadgeCheck, CircleAlert, Info, TriangleAlert } from 'lucide-react';
import TemplateViewer from '../components/templateViewer';

export function meta({}) {
    return [
      { title: "Pigeon/Create Template" },
      { name: "description", content: "Template Crafter" },
    ];
}

export default function createTemplatePage(props) {
    const [body , setBody] = useState("")
    const [title , setTitle] = useState("")
    const [name , setName] = useState("")

    async function createTemplate() {
        let data = JSON.stringify({
          "name": name,
          "title": title,
          "body": body
        });
        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:5000/schema',
          headers: { 
            'Authorization': 'nil', 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios.request(config)
        .then((response) => {
          toast.success("Success " + JSON.stringify(response.data));
        })
        .catch((error) => {
          toast.error("Error Creating Template: "+error);
        });
        
    }



    return <>
        <div className="flex-1 w-full h-full mb-20">
            <div className="flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ">
                <h1 className="text-center w-full text-4xl mb-20 font-semibold">Create a Template</h1>
                <div className="flex flex-row w-full justify-between">
                    <div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Template Name</label>
                            <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={name} onChange={(e) => setName(e.target.value)} placeholder="foo bar" required />
                        </div>
                        <button onClick={createTemplate} className="w-[100%] mt-20 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Create
                            </span>
                        </button>
                    </div>
                    <div>
                        <TemplateEditor text={body} setText={setBody} title={"Body"}></TemplateEditor>
                        <div className="h-10"></div>
                        <TemplateEditor text={title} setText={setTitle} title={"Title"}></TemplateEditor>
                        {/* <TemplateViewer body={"afawf {blah}  af {tities}"} title={"fawfawf"}></TemplateViewer> */}
                    </div>
                </div>
            </div>
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