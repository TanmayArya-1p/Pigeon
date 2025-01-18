import { ToastContainer, toast } from 'react-toastify';
import TemplateCard from "./templateCard"
import { useEffect , useState } from 'react';
import cfg from "./../config.json"

export default function TemplateList({templateListState , setTemplateListState}) {
  const [searchParam , setSearchParam] = useState("")
  const [loading,setLoading] = useState(true)


    async function setSchemas() {
        let url = cfg.SCHEMA_ENGINE_URL+"/schema";
        try {
            const response = await fetch(url, {
            headers: {
              "Authorization": cfg.SCHEMA_ENGINE_AUTH_TOKEN
            }
            });
            const data = await response.json();
            setTemplateListState(data);
            setLoading(false)
        } catch (error) {
          toast.error("Failed to Fetch Templates: " + error)
        }
    }

    useEffect(() => {
      setSchemas()
      let cle = setInterval(setSchemas , 10000)
      return async () => clearInterval(cle)
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
      <button onClick={()=>window.location.href="/create_template"} class="relative inline-flex items-center justify-center ml-24 mt-1 p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
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


    {loading && <div className="w-full mt-32 text-xl text-center text-gray-500">

      <div role="status" className="mt-30">
        <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>}

    {!loading && templateListState.filter((t)=> t.name.toLowerCase().includes(searchParam.toLowerCase())).length==0? <div className="w-full mt-10 text-xl text-center text-gray-500">No Templates Found</div>:null}



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