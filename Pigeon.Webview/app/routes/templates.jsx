import { BadgeCheck, CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import TemplateList from '../components/schemaList';
import { useState } from 'react';


export function meta({}) {
    return [
      { title: "Pigeon/Templates" },
      { name: "description", content: "Tempaltes" },
    ];
  }

  

export default function templatePage(props) {

    const [tList,  setTList] = useState([])

    return <>
        <div className="flex-1 w-full h-full mb-20">
            <div className="flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ">

                <TemplateList templateListState={tList} setTemplateListState={setTList}></TemplateList>
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