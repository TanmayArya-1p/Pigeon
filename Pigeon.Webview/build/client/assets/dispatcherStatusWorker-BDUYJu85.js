import{j as c}from"./jsx-runtime-BjG_zV1W.js";import{r}from"./chunk-K6AXKMTT-BF6vPW5T.js";import{c as i}from"./config-Di1_L0nu.js";const p=r.createContext(),f=({children:o})=>{const[n,a]=r.useState({running:!1,pending:0,served:0,deleted_tokens:0,pending_orders:Array(0)});async function t(){try{fetch(i.DISPATCHER_URL+"/status").then(e=>e.json().then(s=>{console.log("Worker Response ",s),a(s)}))}catch(e){console.error("Worker error:",e)}}return r.useEffect(()=>{t();const e=setInterval(t,5e3);return()=>clearInterval(e)},[]),c.jsx(p.Provider,{value:n,children:o})};export{p as D,f as a};
