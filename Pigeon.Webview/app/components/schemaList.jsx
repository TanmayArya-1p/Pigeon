import { ToastContainer, toast } from 'react-toastify';
import TemplateCard from "./templateCard"
import { useEffect , useState } from 'react';


export default function TemplateList({templateListState , setTemplateListState}) {
  const [searchParam , setSearchParam] = useState("")



    async function setSchemas() {
        let url = "http://localhost:5000/schema";
        try {
            const response = await fetch(url, {
            headers: {
              "Authorization": "nil"
            }
            });
            const data = await response.json();
            setTemplateListState(data);
        } catch (error) {
          toast.error("Failed to Fetch Templates: " + error)
        }
    }

    useEffect(() => {
      setSchemas()
      let cle = setInterval(setSchemas , 10000)
      return () => clearInterval(cle)
    }, [])

    return <>
    
    <div className="flex-row w-full flex">
      <div className="relative w-[40%] ml-[30%] items-center">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none h-full">
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input type="search" value={searchParam} onChange={(t)=> setSearchParam(t.target.value)} id="default-search" className="block w-full text-center p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Templates" required />
        
      </div>
      <button class="relative inline-flex items-center justify-center ml-24 mt-1 p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
      <span class="relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
        
        <div className="flex-row flex p-1">
        <div className="">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>

        </div>
          <div className="ml-2 mt-0.5">
          Create Template
          </div>
        </div>
      </span>
      </button>

    </div>

    {templateListState.filter((t)=> t.name.toLowerCase().includes(searchParam.toLowerCase())).length==0? <div className="w-full mt-10 text-xl text-center text-gray-500">No Templates Found</div>:null}



    <div className="p-4 mt-4 ml-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {templateListState.filter((t)=> t.name.toLowerCase().includes(searchParam.toLowerCase())).map((template, index) => (
        <TemplateCard key={index} template={template} />
      ))}
      </div>

      <ToastContainer />
    </div>
    </>
}