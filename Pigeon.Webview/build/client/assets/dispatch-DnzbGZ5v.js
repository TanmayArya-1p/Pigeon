import{w as y}from"./with-props-CPHBJpbO.js";import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{p as f,r as a}from"./chunk-K6AXKMTT-BF6vPW5T.js";import{a as p}from"./axios-upsvKRUO.js";import{L as k,T as v,B as w,C as j,I as N,y as u}from"./triangle-alert-Bv_F6sZw.js";import{c as g}from"./config-Di1_L0nu.js";function I({}){return[{title:"Pigeon/Dispatch"},{name:"description",content:"Dispatcher"}]}function T(){const s=f();return e.jsxs("ul",{className:"flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400",children:[e.jsx("li",{className:"me-2",children:e.jsx("a",{href:"#single",className:`inline-block px-4 py-3 rounded-lg ${s.hash==="#single"?"text-white bg-blue-600":"hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`,"aria-current":s.hash==="#single"?"page":void 0,children:"Single Target"})}),e.jsx("li",{className:"me-2",children:e.jsx("a",{href:"#campaign",className:`inline-block px-4 py-3 rounded-lg ${s.hash==="#campaign"?"text-white bg-blue-600":"hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`,"aria-current":s.hash==="#campaign"?"page":void 0,children:"Campaign"})})]})}function C(s){const[o,d]=a.useState(""),[l,c]=a.useState(""),[i,h]=a.useState(""),[n,b]=a.useState("");function x(){let r=JSON.stringify({scheduled_at:parseInt(n),message:{to:o,body:i,title:l}}),m={method:"post",maxBodyLength:1/0,url:g.DISPATCHER_URL+"/dispatch",headers:{Authorization:g.DISPATCHER_AUTH_TOKEN,"Content-Type":"application/json"},data:r};p.request(m).then(t=>{console.log(JSON.stringify(t.data)),u.success("Successfully Pushed Order")}).catch(t=>{console.log(t),u.error(`Error in Pushing Order: ${t}`)})}return e.jsxs("div",{className:"mt-10 w-[60%]",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block mb-2 text-sm font-medium text-gray-900 dark:text-white",children:"Scheduled At"}),e.jsx("input",{type:"text",id:"scheduled_at",className:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",value:n,onChange:r=>b(r.target.value),placeholder:"Epoch Unix Time",required:!0})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("label",{className:"block mb-2 text-sm font-medium text-gray-900 dark:text-white",children:"Target"}),e.jsx("input",{type:"text",id:"target",className:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",value:o,onChange:r=>d(r.target.value),placeholder:"ExponentPushToken[xxxxxxx]",required:!0})]}),e.jsxs("div",{className:"mt-5 flex-row flex",children:[e.jsx("textarea",{id:"title",className:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y",value:l,onChange:r=>c(r.target.value),placeholder:"Notification Title",required:!0}),e.jsx("textarea",{id:"body",className:"bg-gray-50 ml-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y",value:i,onChange:r=>h(r.target.value),placeholder:"Notification Body",required:!0})]}),e.jsx("button",{onClick:x,className:"mt-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800",children:e.jsx("span",{className:"relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0",children:"Dispatch"})})]})}function S(s){const[o,d]=a.useState(""),[l,c]=a.useState(""),[i,h]=a.useState(""),[n,b]=a.useState("");function x(){let r=JSON.stringify({scheduled_at:parseInt(n),to:o.trim().split(","),message:{to:o,body:i,title:l}}),m={method:"post",maxBodyLength:1/0,url:g.DISPATCHER_URL+"/campaign",headers:{Authorization:g.DISPATCHER_AUTH_TOKEN,"Content-Type":"application/json"},data:r};p.request(m).then(t=>{console.log(JSON.stringify(t.data)),u.success("Successfully Pushed Order")}).catch(t=>{console.log(t),u.error(`Error in pushing order: ${t}`)})}return e.jsxs("div",{className:"mt-10 w-[60%]",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block mb-2 text-sm font-medium text-gray-900 dark:text-white",children:"Scheduled At"}),e.jsx("input",{type:"text",id:"scheduled_at",className:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",value:n,onChange:r=>b(r.target.value),placeholder:"Epoch Unix Time",required:!0})]}),e.jsxs("div",{className:"mt-3",children:[e.jsx("label",{className:"block mb-2 text-sm font-medium text-gray-900 dark:text-white",children:"Targets"}),e.jsx("input",{type:"text",id:"target",className:"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",value:o,onChange:r=>d(r.target.value),placeholder:"ExponentPushToken[x],ExponentPushToken[x]...(comma separated)",required:!0})]}),e.jsxs("div",{className:"mt-5 flex-row flex w-[100%]",children:[e.jsx("textarea",{id:"title",className:"bg-gray-50 border w-[40%] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y",value:l,onChange:r=>c(r.target.value),placeholder:"Notification Title",required:!0}),e.jsx("textarea",{id:"body",className:"bg-gray-50 ml-5 border w-[40%]  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y",value:i,onChange:r=>h(r.target.value),placeholder:"Notification Body",required:!0})]}),e.jsx("button",{onClick:x,className:"mt-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800",children:e.jsx("span",{className:"relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0",children:"Dispatch"})})]})}const _=y(function(o){const d=f();return a.useEffect(()=>{window.location.hash=d.hash||"#single"},[]),e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex-1 w-full h-full mb-20",children:[e.jsxs("div",{className:"flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ",children:[e.jsx(T,{}),d.hash=="#single"?e.jsx(C,{}):e.jsx(S,{})]}),e.jsx("div",{className:"h-10"})]}),e.jsx(k,{position:"bottom-right",autoClose:5e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!1,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0,theme:"dark",icon:({type:l,theme:c})=>{switch(l){case"info":return e.jsx(N,{className:"stroke-indigo-400"});case"error":return e.jsx(j,{className:"stroke-red-500"});case"success":return e.jsx(w,{className:"stroke-green-500"});case"warning":return e.jsx(v,{className:"stroke-yellow-500"});default:return null}}})]})});export{_ as default,I as meta};
