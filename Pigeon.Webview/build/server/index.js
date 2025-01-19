import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useParams, useLoaderData, useActionData, useMatches, useRouteError, NavLink, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, useLocation, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import React, { createElement, createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { TriangleAlert, BadgeCheck, CircleAlert, Info } from "lucide-react";
import { Tooltip } from "react-tooltip";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const stylesheet = "/assets/app-BzW_dyZB.css";
const pigeonLogo = "/assets/pigeon-ClkBbliK.png";
const DISPATCHER_URL = "https://pigeon-dispatcher.onetincan.tech";
const SCHEMA_ENGINE_URL = "https://pigeon-schema-engine.onetincan.tech";
const DISPATCHER_AUTH_TOKEN = "nil";
const SCHEMA_ENGINE_AUTH_TOKEN = "nil";
const cfg = {
  DISPATCHER_URL,
  SCHEMA_ENGINE_URL,
  DISPATCHER_AUTH_TOKEN,
  SCHEMA_ENGINE_AUTH_TOKEN
};
const DispatcherStatusContext = createContext();
const DispatcherStatusProvider = ({ children }) => {
  const [dispatcherStatus, setDispatcherStatus] = useState({ running: false, pending: 0, served: 0, deleted_tokens: 0, pending_orders: Array(0) });
  async function __worker() {
    try {
      fetch(cfg.DISPATCHER_URL + "/status").then((r) => r.json().then((a) => {
        console.log("Worker Response ", a);
        setDispatcherStatus(a);
      }));
    } catch (error) {
      console.error("Worker error:", error);
    }
  }
  useEffect(() => {
    __worker();
    const intervalId = setInterval(__worker, 5e3);
    return () => clearInterval(intervalId);
  }, []);
  return /* @__PURE__ */ jsx(DispatcherStatusContext.Provider, { value: dispatcherStatus, children });
};
function Sidebar() {
  const dispatcherStatus = useContext(DispatcherStatusContext);
  let authHeader = new Headers();
  authHeader.append("Content-Type", "application/json");
  authHeader.append("Authorization", cfg.DISPATCHER_AUTH_TOKEN);
  function toggleRunningStatus() {
    console.log("TRIED TO TOGGLE");
    if (dispatcherStatus.running) {
      fetch(cfg.DISPATCHER_URL + "/stop", { headers: authHeader }).then((r) => r.json().then((a) => {
        console.log("Starter Response ", a);
      }));
    } else {
      fetch(cfg.DISPATCHER_URL + "/start?interval=5", { headers: authHeader }).then((r) => r.json().then((a) => {
        console.log("Starter Response ", a);
      }));
    }
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("nav", { className: "fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700", children: /* @__PURE__ */ jsx("div", { className: "px-3 py-3 lg:px-5 lg:pl-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-start rtl:justify-end", children: [
        /* @__PURE__ */ jsxs("button", { "data-drawer-target": "logo-sidebar", "data-drawer-toggle": "logo-sidebar", "aria-controls": "logo-sidebar", type: "button", className: "inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600", children: [
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open sidebar" }),
          /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", "aria-hidden": "true", fill: "currentColor", viewBox: "0 0 20 20", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("path", { clipRule: "evenodd", fillRule: "evenodd", d: "M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" }) })
        ] }),
        /* @__PURE__ */ jsxs(NavLink, { to: "/", className: "flex items-center p-2 text-sm font-semibold text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700", children: [
          /* @__PURE__ */ jsx("img", { src: pigeonLogo, className: "h-8 me-3", alt: "Pigeon Logo" }),
          /* @__PURE__ */ jsx("span", { className: "self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white", children: "Pigeon Webview" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border p-3 rounded-xl flex flex-row mb-1", children: [
        /* @__PURE__ */ jsx("div", { children: "Dispatcher" }),
        /* @__PURE__ */ jsx("div", { className: "ml-3 mr-3", children: "|" }),
        /* @__PURE__ */ jsx("div", { className: "flex-row", children: dispatcherStatus.running ? /* @__PURE__ */ jsxs("div", { className: "text-green-500 flex-row flex", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 mt-2 mr-2 bg-green-500 rounded-full border" }),
          " Running"
        ] }) : /* @__PURE__ */ jsxs("div", { className: "text-red-500 flex-row flex", children: [
          /* @__PURE__ */ jsx("div", { className: "w-2 h-2 mt-2 mr-2 bg-red-500 rounded-full border" }),
          " Stopped"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { children: dispatcherStatus.running ? /* @__PURE__ */ jsx("button", { type: "button", className: "ml-5 mt-1 flex items-center text-red-500 text-center bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700", onClick: toggleRunningStatus, children: "▢ Stop" }) : /* @__PURE__ */ jsx("button", { type: "button", className: "ml-5 mt-1 flex items-center text-green-500 text-center bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700", onClick: toggleRunningStatus, children: "▷  Start" }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("aside", { id: "logo-sidebar", className: "fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700", "aria-label": "Sidebar", children: /* @__PURE__ */ jsx("div", { className: "h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800", children: /* @__PURE__ */ jsxs("ul", { className: "space-y-2 mt-5 font-medium", children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/",
          className: "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
          children: [
            "                        ",
            /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 22 21", children: [
              /* @__PURE__ */ jsx("path", { d: "M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" }),
              /* @__PURE__ */ jsx("path", { d: "M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "ms-3", children: "Dashboard" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/pending_orders",
          className: "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
          children: [
            "                        ",
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" }) }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 ms-3 whitespace-nowrap", children: "Pending Orders" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/dispatch#single",
          className: "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
          children: [
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" }) }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 ms-3 whitespace-nowrap", children: "Dispatch" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/templates",
          className: "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
          children: [
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" }) }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 ms-3 whitespace-nowrap", children: "Templates" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        NavLink,
        {
          to: "/create_template",
          className: "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
          children: [
            /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" }) }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 ms-3 whitespace-nowrap", children: "Create Template" })
          ]
        }
      ) })
    ] }) }) })
  ] });
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}, {
  rel: "stylesheet",
  href: stylesheet
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(DispatcherStatusProvider, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "app-container flex",
          children: [/* @__PURE__ */ jsx(Sidebar, {}), /* @__PURE__ */ jsx("main", {
            className: "main-content flex-grow flex justify-center items-center",
            children
          })]
        })
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function formatDate(epochTime) {
  const date = new Date(epochTime * 1e3);
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };
  const dateOptions = {
    month: "long",
    day: "numeric",
    year: "numeric"
  };
  const formattedTime = date.toLocaleString("en-US", timeOptions);
  const formattedDate = date.toLocaleString("en-US", dateOptions);
  return `${formattedTime} ${formattedDate}`;
}
function PendingOrdersList({ Iscollapsible, limit = 5 }) {
  const dispatcherStatus = useContext(DispatcherStatusContext);
  if (limit == -1) {
    limit = dispatcherStatus.pending_orders.length;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-x-auto shadow-md sm:rounded-lg w-full", children: [
    /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400", children: [
      /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-center", children: "Queue" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-center", children: "Target" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-center", children: "Scheduled At" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-center", children: "Body" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3 text-center", children: "Title" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        dispatcherStatus.pending_orders.slice(0, limit).map((order, index) => {
          console.log("Mapping ", order, Array.isArray(dispatcherStatus.pending_orders));
          return /* @__PURE__ */ jsxs("tr", { className: "odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700", children: [
            /* @__PURE__ */ jsx("th", { scope: "row", className: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center", children: index + 1 }),
            /* @__PURE__ */ jsx("th", { scope: "row", className: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center", children: order.message.to }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: formatDate(order.scheduled_at) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: order.message.body.length > 10 ? order.message.body.slice(0, 10) + "..." : order.message.body }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-center", children: order.message.title.length > 10 ? order.message.title.slice(0, 10) + "..." : order.message.title })
          ] }, index);
        }),
        limit != -1 && dispatcherStatus.pending_orders.length > limit && /* @__PURE__ */ jsx("tr", { className: "odd:bg-white rounded-md odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700", children: /* @__PURE__ */ jsx("td", { colSpan: "5", className: " text-center", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.location.href = "/pending_orders",
            className: "px-4 text-center py-2 w-full bg-inherit text-white rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50  hover:bg-gray-700",
            children: "..."
          }
        ) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-10" })
  ] }) });
}
function meta$5({}) {
  return [{
    title: "Pigeon"
  }, {
    name: "description",
    content: "Pigeon Home"
  }];
}
const home = withComponentProps(function Home() {
  const dispatcherStatus = React.useContext(DispatcherStatusContext);
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "flex-1 w-full h-full",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-row mt-[7%] ml-[20%]",
        children: [/* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsxs("a", {
            className: "block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700",
            children: [/* @__PURE__ */ jsx("h5", {
              className: "mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white",
              children: "Served Orders"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-2xl text-center text-gray-700 dark:text-gray-400",
              children: dispatcherStatus.served
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsxs("a", {
            className: "block ml-5 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700",
            children: [/* @__PURE__ */ jsx("h5", {
              className: "mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white",
              children: "Pending Orders"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-2xl text-center text-gray-700 dark:text-gray-400",
              children: dispatcherStatus.pending
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsxs("a", {
            className: "block ml-5 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700",
            children: [/* @__PURE__ */ jsx("h5", {
              className: "mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white",
              children: "Deleted Tokens"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-2xl text-center text-gray-700 dark:text-gray-400",
              children: dispatcherStatus.deleted_tokens
            })]
          })
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-start w-[75%] ml-[20%] mt-8",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-4xl mb-6",
          children: "Pending Orders"
        }), /* @__PURE__ */ jsx(PendingOrdersList, {})]
      })]
    })
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
function meta$4({}) {
  return [{
    title: "Pigeon/Pending"
  }, {
    name: "description",
    content: "Pending Orders"
  }];
}
const pending_orders = withComponentProps(function PendingOrders() {
  const dispatherStatus = useContext(DispatcherStatusContext);
  return /* @__PURE__ */ jsxs("div", {
    className: "flex-1 w-full h-full mb-20",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ",
      children: [/* @__PURE__ */ jsx("div", {
        className: "text-4xl mb-6",
        children: "Pending Orders"
      }), /* @__PURE__ */ jsx(PendingOrdersList, {
        limit: dispatherStatus.pending_orders.length
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "h-10"
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pending_orders,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function meta$3({}) {
  return [{
    title: "Pigeon/Dispatch"
  }, {
    name: "description",
    content: "Dispatcher"
  }];
}
function DispatchChoiceTab() {
  const location = useLocation();
  return /* @__PURE__ */ jsxs("ul", {
    className: "flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400",
    children: [/* @__PURE__ */ jsx("li", {
      className: "me-2",
      children: /* @__PURE__ */ jsx("a", {
        href: "#single",
        className: `inline-block px-4 py-3 rounded-lg ${location.hash === "#single" ? "text-white bg-blue-600" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`,
        "aria-current": location.hash === "#single" ? "page" : void 0,
        children: "Single Target"
      })
    }), /* @__PURE__ */ jsx("li", {
      className: "me-2",
      children: /* @__PURE__ */ jsx("a", {
        href: "#campaign",
        className: `inline-block px-4 py-3 rounded-lg ${location.hash === "#campaign" ? "text-white bg-blue-600" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`,
        "aria-current": location.hash === "#campaign" ? "page" : void 0,
        children: "Campaign"
      })
    })]
  });
}
function SingleTargetDispatch(props) {
  const [target, setTarget] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
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
      method: "post",
      maxBodyLength: Infinity,
      url: cfg.DISPATCHER_URL + "/dispatch",
      headers: {
        "Authorization": cfg.DISPATCHER_AUTH_TOKEN,
        "Content-Type": "application/json"
      },
      data
    };
    axios.request(config).then((response) => {
      console.log(JSON.stringify(response.data));
      toast.success("Successfully Pushed Order");
    }).catch((error) => {
      console.log(error);
      toast.error(`Error in Pushing Order: ${error}`);
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "mt-10 w-[60%]",
    children: [/* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("label", {
        className: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        children: "Scheduled At"
      }), /* @__PURE__ */ jsx("input", {
        type: "text",
        id: "scheduled_at",
        className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        value: scheduledAt,
        onChange: (e) => setScheduledAt(e.target.value),
        placeholder: "Epoch Unix Time",
        required: true
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-3",
      children: [/* @__PURE__ */ jsx("label", {
        className: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        children: "Target"
      }), /* @__PURE__ */ jsx("input", {
        type: "text",
        id: "target",
        className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        value: target,
        onChange: (e) => setTarget(e.target.value),
        placeholder: "ExponentPushToken[xxxxxxx]",
        required: true
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-5 flex-row flex",
      children: [/* @__PURE__ */ jsx("textarea", {
        id: "title",
        className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        placeholder: "Notification Title",
        required: true
      }), /* @__PURE__ */ jsx("textarea", {
        id: "body",
        className: "bg-gray-50 ml-5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y",
        value: body,
        onChange: (e) => setBody(e.target.value),
        placeholder: "Notification Body",
        required: true
      })]
    }), /* @__PURE__ */ jsx("button", {
      onClick: submitDispatch,
      className: "mt-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800",
      children: /* @__PURE__ */ jsx("span", {
        className: "relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0",
        children: "Dispatch"
      })
    })]
  });
}
function CampaignDispatch(props) {
  const [target, setTarget] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
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
      method: "post",
      maxBodyLength: Infinity,
      url: cfg.DISPATCHER_URL + "/campaign",
      headers: {
        "Authorization": cfg.DISPATCHER_AUTH_TOKEN,
        "Content-Type": "application/json"
      },
      data
    };
    axios.request(config).then((response) => {
      console.log(JSON.stringify(response.data));
      toast.success("Successfully Pushed Order");
    }).catch((error) => {
      console.log(error);
      toast.error(`Error in pushing order: ${error}`);
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "mt-10 w-[60%]",
    children: [/* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("label", {
        className: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        children: "Scheduled At"
      }), /* @__PURE__ */ jsx("input", {
        type: "text",
        id: "scheduled_at",
        className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        value: scheduledAt,
        onChange: (e) => setScheduledAt(e.target.value),
        placeholder: "Epoch Unix Time",
        required: true
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-3",
      children: [/* @__PURE__ */ jsx("label", {
        className: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        children: "Targets"
      }), /* @__PURE__ */ jsx("input", {
        type: "text",
        id: "target",
        className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        value: target,
        onChange: (e) => setTarget(e.target.value),
        placeholder: "ExponentPushToken[x],ExponentPushToken[x]...(comma separated)",
        required: true
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-5 flex-row flex w-[100%]",
      children: [/* @__PURE__ */ jsx("textarea", {
        id: "title",
        className: "bg-gray-50 border w-[40%] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y",
        value: title,
        onChange: (e) => setTitle(e.target.value),
        placeholder: "Notification Title",
        required: true
      }), /* @__PURE__ */ jsx("textarea", {
        id: "body",
        className: "bg-gray-50 ml-5 border w-[40%]  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 resize-y",
        value: body,
        onChange: (e) => setBody(e.target.value),
        placeholder: "Notification Body",
        required: true
      })]
    }), /* @__PURE__ */ jsx("button", {
      onClick: submitDispatch,
      className: "mt-5 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800",
      children: /* @__PURE__ */ jsx("span", {
        className: "relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-900 rounded-md group-hover:bg-opacity-0",
        children: "Dispatch"
      })
    })]
  });
}
const dispatch = withComponentProps(function DispatchPage(props) {
  const location = useLocation();
  useEffect(() => {
    window.location.hash = location.hash || "#single";
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex-1 w-full h-full mb-20",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ",
        children: [/* @__PURE__ */ jsx(DispatchChoiceTab, {}), location.hash == "#single" ? /* @__PURE__ */ jsx(SingleTargetDispatch, {}) : /* @__PURE__ */ jsx(CampaignDispatch, {})]
      }), /* @__PURE__ */ jsx("div", {
        className: "h-10"
      })]
    }), /* @__PURE__ */ jsx(ToastContainer, {
      position: "bottom-right",
      autoClose: 5e3,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: false,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: "dark",
      icon: ({
        type,
        theme
      }) => {
        switch (type) {
          case "info":
            return /* @__PURE__ */ jsx(Info, {
              className: "stroke-indigo-400"
            });
          case "error":
            return /* @__PURE__ */ jsx(CircleAlert, {
              className: "stroke-red-500"
            });
          case "success":
            return /* @__PURE__ */ jsx(BadgeCheck, {
              className: "stroke-green-500"
            });
          case "warning":
            return /* @__PURE__ */ jsx(TriangleAlert, {
              className: "stroke-yellow-500"
            });
          default:
            return null;
        }
      }
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DispatchChoiceTab,
  default: dispatch,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function TemplateCard({ template: template2 }) {
  console.log(template2);
  const handleCopy = () => {
    navigator.clipboard.writeText(template2.id).then(() => {
      toast.success(template2.id + " copied to clipboard");
    }).catch((err) => {
      toast.error("Failed to copy: ", err);
    });
  };
  return /* @__PURE__ */ jsx("a", { href: `/template/${template2.id}`, className: "block p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsx("div", { className: "text-lg text-white truncate w-40 text-center", children: template2.name }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center mt-2", children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm text-white", children: template2.id.slice(0, 10) + "..." }),
      /* @__PURE__ */ jsx("button", { className: "ml-2", onClick: handleCopy, children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-4 h-4", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" }) }) })
    ] })
  ] }) });
}
function TemplateList({ templateListState, setTemplateListState }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(true);
  async function setSchemas() {
    let url = cfg.SCHEMA_ENGINE_URL + "/schema";
    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": cfg.SCHEMA_ENGINE_AUTH_TOKEN
        }
      });
      const data = await response.json();
      setTemplateListState(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to Fetch Templates: " + error);
    }
  }
  useEffect(() => {
    setSchemas();
    let cle = setInterval(setSchemas, 1e4);
    return async () => clearInterval(cle);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-row w-full flex", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-[40%] ml-[30%] items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none h-full", children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 text-gray-500 dark:text-gray-400", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2", d: "m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" }) }) }),
        /* @__PURE__ */ jsx("input", { type: "search", value: searchParam, onChange: (t) => setSearchParam(t.target.value), id: "default-search", className: "block w-full text-center p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500", placeholder: "Search Templates", required: true })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => window.location.href = "/create_template", class: "relative inline-flex items-center justify-center ml-24 mt-1 p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800", children: /* @__PURE__ */ jsx("span", { class: "relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0", children: /* @__PURE__ */ jsxs("div", { className: "flex-row flex p-1", children: [
        /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", class: "size-6", children: /* @__PURE__ */ jsx("path", { "fill-rule": "evenodd", d: "M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z", "clip-rule": "evenodd" }) }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-2 mt-0.5", children: "Create Template" })
      ] }) }) })
    ] }),
    loading && /* @__PURE__ */ jsx("div", { className: "w-full mt-32 text-xl text-center text-gray-500", children: /* @__PURE__ */ jsxs("div", { role: "status", className: "mt-30", children: [
      /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", class: "inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
        /* @__PURE__ */ jsx("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }),
        /* @__PURE__ */ jsx("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })
      ] }),
      /* @__PURE__ */ jsx("span", { class: "sr-only", children: "Loading..." })
    ] }) }),
    !loading && templateListState.filter((t) => t.name.toLowerCase().includes(searchParam.toLowerCase())).length == 0 ? /* @__PURE__ */ jsx("div", { className: "w-full mt-10 text-xl text-center text-gray-500", children: "No Templates Found" }) : null,
    !loading && /* @__PURE__ */ jsxs("div", { className: "p-4 mt-4 ml-6", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4", children: templateListState.filter((t) => t.name.toLowerCase().includes(searchParam.toLowerCase())).map((template2, index) => /* @__PURE__ */ jsx(TemplateCard, { template: template2 }, index)) }),
      /* @__PURE__ */ jsx(ToastContainer, {})
    ] })
  ] });
}
function meta$2({}) {
  return [{
    title: "Pigeon/Templates"
  }, {
    name: "description",
    content: "Tempaltes"
  }];
}
const templates = withComponentProps(function templatePage(props) {
  const [tList, setTList] = useState([]);
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("div", {
      className: "flex-1 w-full h-full mb-20",
      children: /* @__PURE__ */ jsx("div", {
        className: "flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ",
        children: /* @__PURE__ */ jsx(TemplateList, {
          templateListState: tList,
          setTemplateListState: setTList
        })
      })
    }), /* @__PURE__ */ jsx(ToastContainer, {
      position: "bottom-right",
      autoClose: 5e3,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: false,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: "dark",
      icon: ({
        type,
        theme
      }) => {
        switch (type) {
          case "info":
            return /* @__PURE__ */ jsx(Info, {
              className: "stroke-indigo-400"
            });
          case "error":
            return /* @__PURE__ */ jsx(CircleAlert, {
              className: "stroke-red-500"
            });
          case "success":
            return /* @__PURE__ */ jsx(BadgeCheck, {
              className: "stroke-green-500"
            });
          case "warning":
            return /* @__PURE__ */ jsx(TriangleAlert, {
              className: "stroke-yellow-500"
            });
          default:
            return null;
        }
      }
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: templates,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function TemplateEditor({ text, setText, title }) {
  const [highlightedText, setHighlightedText] = useState("");
  const [highlightedList, setHighlightedList] = useState([]);
  const editorRef = useRef(null);
  useEffect(() => {
    highlightText(text);
  }, [text]);
  const handleInputChange = (e) => {
    const newText = e.target.innerText;
    setText(newText);
  };
  const highlightText = (text2) => {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let highlighted = text2.replace(regex, (match2, p1) => {
      matches.push(p1);
      return `<span class="highlight">${match2}</span>`;
    });
    setHighlightedText(highlighted);
    setHighlightedList(matches);
  };
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(editorRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;
      return {
        start,
        end: start + range.toString().length
      };
    }
    return null;
  };
  const restoreSelection = (savedSel) => {
    const charIndex = { start: 0, end: 0 };
    const nodeStack = [editorRef.current];
    let node, foundStart = false, stop = false;
    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        const nextCharIndex = charIndex.start + node.length;
        if (!foundStart && savedSel.start >= charIndex.start && savedSel.start <= nextCharIndex) {
          const range = document.createRange();
          range.setStart(node, savedSel.start - charIndex.start);
          if (savedSel.end <= nextCharIndex) {
            range.setEnd(node, savedSel.end - charIndex.start);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            stop = true;
          }
          foundStart = true;
        }
        charIndex.start = nextCharIndex;
      } else {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }
  };
  useEffect(() => {
    const savedSel = saveSelection();
    if (editorRef.current) {
      editorRef.current.innerHTML = highlightedText;
    }
    if (savedSel) {
      restoreSelection(savedSel);
    }
  }, [highlightedText]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-tr-lg rounded-tl-lg flex-row flex p-1 bg-gray-800 border-t border-l border-r border-gray-500", children: [
      /* @__PURE__ */ jsx("div", { className: "ml-2 mt-1 mb-1", "data-tooltip-id": "tooltip", "data-tooltip-content": "Provide Parameters Within {}(curly braces)", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-3.5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" }) }) }),
      /* @__PURE__ */ jsx(Tooltip, { id: "tooltip" }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-500 ml-1.5 font-mono text-sm mt-", children: "TemplateText" }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-500 ml-1.5 font-mono text-sm ml-10 font-semibold", children: title })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: editorRef,
        contentEditable: true,
        className: "border-gray-500 border-l border-t border-r p-2 focus:outline-none",
        style: { whiteSpace: "pre-wrap", width: "600px", overflowX: "auto" },
        onInput: handleInputChange
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "border-gray-500 flex-row flex p-2 font-mono text-sm bg-gray-900 border p-2 rounded-br-lg rounded-bl-lg focus:outline-none", children: [
      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", "data-tooltip-id": "parameters", "data-tooltip-content": "Parameters", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.745 3A23.933 23.933 0 0 0 3 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402l2.402 7.206a.75.75 0 0 0 1.104.401l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09" }) }),
      /* @__PURE__ */ jsx(Tooltip, { id: "parameters" }),
      ":",
      " " + highlightedList.join(", ")
    ] }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
        .highlight {
          background-color: green;
          color: white;
        }
      ` })
  ] });
}
function TemplateViewer({ title, body }) {
  const [highlightedText, setHighlightedText] = useState("");
  const [highlightedList, setHighlightedList] = useState([]);
  useEffect(() => {
    highlightText(body);
  }, [body]);
  const highlightText = (text) => {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let highlighted = text.replace(regex, (match2, p1) => {
      matches.push(p1);
      return `<span class="highlight">${match2}</span>`;
    });
    setHighlightedText(highlighted);
    setHighlightedList(matches);
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-tr-lg rounded-tl-lg flex-row flex p-1 bg-gray-800 border-t border-l border-r border-gray-500", children: [
      /* @__PURE__ */ jsx("div", { className: "ml-2 mt-1 mb-1", "data-tooltip-id": "tooltip", "data-tooltip-content": "Provide Parameters Within {}(curly braces)", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-3.5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" }) }) }),
      /* @__PURE__ */ jsx(Tooltip, { id: "tooltip" }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-500 ml-1.5 font-mono text-sm mt-", children: "TemplateText (Read-Only)" }),
      /* @__PURE__ */ jsx("div", { className: "text-gray-500 ml-1.5 font-mono text-sm ml-10 font-semibold", children: title })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "border-gray-500 border-l border-t border-r p-2 focus:outline-none",
        style: { whiteSpace: "pre-wrap", width: "600px", overflowX: "auto" },
        dangerouslySetInnerHTML: { __html: highlightedText }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "border-gray-500 flex-row flex p-2 font-mono text-sm bg-gray-900 border p-2 rounded-br-lg rounded-bl-lg focus:outline-none", children: [
      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", "data-tooltip-id": "parameters", "data-tooltip-content": "Parameters", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-5", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4.745 3A23.933 23.933 0 0 0 3 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402l2.402 7.206a.75.75 0 0 0 1.104.401l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09" }) }),
      /* @__PURE__ */ jsx(Tooltip, { id: "parameters" }),
      ":",
      " " + highlightedList.join(", ")
    ] }),
    /* @__PURE__ */ jsx("style", { jsx: true, children: `
        .highlight {
          background-color: green;
          color: white;
        }
      ` })
  ] });
}
function meta$1({}) {
  return [{
    title: "Pigeon/Create Template"
  }, {
    name: "description",
    content: "Template Crafter"
  }];
}
const create_template = withComponentProps(function createTemplatePage(props) {
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  async function createTemplate() {
    let data = JSON.stringify({
      "name": name,
      "title": title,
      "body": body
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: cfg.SCHEMA_ENGINE_URL + "/schema",
      headers: {
        "Authorization": cfg.SCHEMA_ENGINE_AUTH_TOKEN,
        "Content-Type": "application/json"
      },
      data
    };
    axios.request(config).then((response) => {
      toast.success("Success " + JSON.stringify(response.data));
    }).catch((error) => {
      toast.error("Error Creating Template: " + error);
    });
  }
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("div", {
      className: "flex-1 w-full h-full mb-20",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-center w-full text-4xl mb-20 font-semibold",
          children: "Create a Template"
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex flex-row w-full justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("div", {
              children: [/* @__PURE__ */ jsx("label", {
                className: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
                children: "Template Name"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                id: "name",
                className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "foo bar",
                required: true
              })]
            }), /* @__PURE__ */ jsx("button", {
              onClick: createTemplate,
              className: "w-[100%] mt-20 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800",
              children: /* @__PURE__ */ jsx("span", {
                className: "w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0",
                children: "Create"
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx(TemplateEditor, {
              text: body,
              setText: setBody,
              title: "Body"
            }), /* @__PURE__ */ jsx("div", {
              className: "h-10"
            }), /* @__PURE__ */ jsx(TemplateEditor, {
              text: title,
              setText: setTitle,
              title: "Title"
            })]
          })]
        })]
      })
    }), /* @__PURE__ */ jsx(ToastContainer, {
      position: "bottom-right",
      autoClose: 5e3,
      hideProgressBar: false,
      newestOnTop: false,
      closeOnClick: false,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
      theme: "dark",
      icon: ({
        type,
        theme
      }) => {
        switch (type) {
          case "info":
            return /* @__PURE__ */ jsx(Info, {
              className: "stroke-indigo-400"
            });
          case "error":
            return /* @__PURE__ */ jsx(CircleAlert, {
              className: "stroke-red-500"
            });
          case "success":
            return /* @__PURE__ */ jsx(BadgeCheck, {
              className: "stroke-green-500"
            });
          case "warning":
            return /* @__PURE__ */ jsx(TriangleAlert, {
              className: "stroke-yellow-500"
            });
          default:
            return null;
        }
      }
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: create_template,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta({}) {
  return [{
    title: "Loading Template"
  }, {
    name: "description",
    content: "Template View"
  }];
}
const template = withComponentProps(function TemplatePage() {
  let {
    id
  } = useParams();
  const [loading, setLoading] = useState(true);
  const [template2, setTemplate] = useState();
  const [target, setTarget] = useState("");
  const [params, setParams] = useState({});
  const [scheduledAt, setScheduledAt] = useState("");
  const handleCopy = () => {
    navigator.clipboard.writeText(template2.id).then(() => {
      toast.success(template2.id + " copied to clipboard");
    }).catch((err) => {
      toast.error("Failed to copy: ", err);
    });
  };
  async function fetchTemplate(tid) {
    console.log("Fetching Template ", tid);
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: cfg.SCHEMA_ENGINE_URL + `/schema/${tid}`,
      headers: {
        "Authorization": cfg.SCHEMA_ENGINE_AUTH_TOKEN,
        "Content-Type": "application/json"
      }
    };
    axios.request(config).then((response) => {
      console.log(JSON.stringify(response.data));
      toast.success("Success Fetching Template");
      setTemplate(response.data);
      setLoading(false);
      document.title = response.data.name;
      response.data.params.forEach((a) => params[a] = "");
    }).catch((error) => {
      console.log(error);
      toast.error("Error Fetching Template: " + error);
      setTimeout(() => window.location.href = "/templates", 2e3);
    });
  }
  async function HandleDelete() {
    if (!confirm(`Are u sure u want to delete template '${template2.name}'?`)) {
      return;
    }
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: cfg.SCHEMA_ENGINE_URL + "/schema/" + id,
      headers: {
        "Authorization": cfg.SCHEMA_ENGINE_AUTH_TOKEN
      }
    };
    axios.request(config).then((_) => {
      toast.success("Successfully Deleted '" + template2.name + "'");
      setTimeout(() => window.location.href = "/templates", 2e3);
    }).catch((error) => {
      toast.error("Delete Failed " + error);
    });
  }
  async function HandleDispatch() {
    let data = {
      "scheduled_at": parseInt(scheduledAt),
      "targets": target.trim().split(","),
      "params": params
    };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: cfg.SCHEMA_ENGINE_URL + "/dispatch/" + id,
      headers: {
        "Content-Type": "application/json",
        "Authorization": cfg.SCHEMA_ENGINE_AUTH_TOKEN
      },
      data
    };
    axios.request(config).then((response) => {
      toast.success("Template Notification Dispatched");
    }).catch((error) => {
      toast.error("Failed to Dispatch Notification");
    });
  }
  useEffect(() => {
    fetchTemplate(id);
  }, []);
  return /* @__PURE__ */ jsx("div", {
    className: "flex-1 w-full h-full mb-20",
    children: /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col items-start w-[75%] ml-[20%] mt-[10%] ",
      children: [loading ? /* @__PURE__ */ jsx("div", {
        className: "w-full mt-32 text-xl text-center text-gray-500",
        children: /* @__PURE__ */ jsxs("div", {
          role: "status",
          className: "mt-30",
          children: [/* @__PURE__ */ jsxs("svg", {
            "aria-hidden": "true",
            className: "inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600",
            viewBox: "0 0 100 101",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: [/* @__PURE__ */ jsx("path", {
              d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
              fill: "currentColor"
            }), /* @__PURE__ */ jsx("path", {
              d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
              fill: "currentFill"
            })]
          }), /* @__PURE__ */ jsx("span", {
            className: "sr-only",
            children: "Loading..."
          })]
        })
      }) : /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-row",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "font-sans text-6xl",
            children: loading ? null : template2.name.length > 25 ? template2.name.slice(0, 25) + "..." : template2.name
          }), /* @__PURE__ */ jsx("button", {
            onClick: HandleDelete,
            className: "mt-1.5 ml-8 rounded-lg hover:bg-red-600 p-4 group",
            children: /* @__PURE__ */ jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: 1.5,
              stroke: "currentColor",
              className: "size-6 group-hover:stroke-black",
              children: /* @__PURE__ */ jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              })
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex flex-row",
          children: [/* @__PURE__ */ jsx("p", {
            children: id
          }), /* @__PURE__ */ jsx("button", {
            className: "ml-2",
            onClick: handleCopy,
            children: /* @__PURE__ */ jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: 1.5,
              stroke: "currentColor",
              className: "w-4 h-4",
              children: /* @__PURE__ */ jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              })
            })
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex-row flex",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("div", {
              className: "mt-10",
              children: /* @__PURE__ */ jsx(TemplateViewer, {
                title: "Notification Title",
                body: template2.title
              })
            }), /* @__PURE__ */ jsx("div", {
              className: "mt-10",
              children: /* @__PURE__ */ jsx(TemplateViewer, {
                title: "Notification Body",
                body: template2.body
              })
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsxs("div", {
              className: "ml-20 mt-5 w-full",
              children: [/* @__PURE__ */ jsx("label", {
                className: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
                children: "Targets"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                id: "target",
                className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                value: target,
                onChange: (e) => setTarget(e.target.value),
                placeholder: "ExponentPushToken[](Comma Separated)",
                required: true
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "ml-20 mt-5 w-full",
              children: [/* @__PURE__ */ jsx("label", {
                className: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
                children: "Scheduled At"
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                id: "target",
                className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                value: scheduledAt,
                onChange: (e) => setScheduledAt(e.target.value),
                placeholder: "Unix Epoch Time",
                required: true
              })]
            }), template2.params && template2.params.map((param, index) => /* @__PURE__ */ jsxs("div", {
              className: "ml-20 mt-5 w-full",
              children: [/* @__PURE__ */ jsxs("label", {
                className: "block mb-2 flex flex-row text-sm font-medium text-gray-900 dark:text-white font-mono",
                children: [/* @__PURE__ */ jsx("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  "data-tooltip-id": "parameters",
                  "data-tooltip-content": "Parameter",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  strokeWidth: 1.5,
                  stroke: "currentColor",
                  className: "size-5 mr-2",
                  children: /* @__PURE__ */ jsx("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M4.745 3A23.933 23.933 0 0 0 3 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 0 1 1.105.402l2.402 7.206a.75.75 0 0 0 1.104.401l1.445-.889m-8.25.75.213.09a1.687 1.687 0 0 0 2.062-.617l4.45-6.676a1.688 1.688 0 0 1 2.062-.618l.213.09"
                  })
                }), param]
              }), /* @__PURE__ */ jsx("input", {
                type: "text",
                id: param,
                className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                value: params[param],
                onChange: (e) => setParams({
                  ...params,
                  [param]: e.target.value
                }),
                placeholder: `Enter ${param}`,
                required: true
              })]
            }, index)), /* @__PURE__ */ jsxs("button", {
              onClick: () => HandleDispatch(),
              className: "w-[100%] mt-10 ml-20 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800",
              children: [/* @__PURE__ */ jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 2,
                stroke: "black",
                className: "size-6 mr-4 ml-4",
                children: /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                })
              }), /* @__PURE__ */ jsx("span", {
                className: "w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0",
                children: "Dispatch"
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsx(ToastContainer, {
        position: "bottom-right",
        autoClose: 5e3,
        hideProgressBar: false,
        newestOnTop: false,
        closeOnClick: false,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        theme: "dark",
        icon: ({
          type,
          theme
        }) => {
          switch (type) {
            case "info":
              return /* @__PURE__ */ jsx(Info, {
                className: "stroke-indigo-400"
              });
            case "error":
              return /* @__PURE__ */ jsx(CircleAlert, {
                className: "stroke-red-500"
              });
            case "success":
              return /* @__PURE__ */ jsx(BadgeCheck, {
                className: "stroke-green-500"
              });
            case "warning":
              return /* @__PURE__ */ jsx(TriangleAlert, {
                className: "stroke-yellow-500"
              });
            default:
              return null;
          }
        }
      })]
    })
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: template,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const not_found = withComponentProps(function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  return null;
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: not_found
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DCj76ksy.js", "imports": ["/assets/jsx-runtime-BjG_zV1W.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-pTEVzIm4.js", "imports": ["/assets/jsx-runtime-BjG_zV1W.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js", "/assets/with-props-CPHBJpbO.js", "/assets/dispatcherStatusWorker-C63exuwm.js", "/assets/config-zxJQ3bqG.js"], "css": [] }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/home-BlhWRx-J.js", "imports": ["/assets/with-props-CPHBJpbO.js", "/assets/jsx-runtime-BjG_zV1W.js", "/assets/pendingOrders-0fThAgeG.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js", "/assets/dispatcherStatusWorker-C63exuwm.js", "/assets/config-zxJQ3bqG.js"], "css": [] }, "routes/pending_orders": { "id": "routes/pending_orders", "parentId": "root", "path": "pending_orders", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/pending_orders-BgdvxJ1_.js", "imports": ["/assets/with-props-CPHBJpbO.js", "/assets/jsx-runtime-BjG_zV1W.js", "/assets/pendingOrders-0fThAgeG.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js", "/assets/dispatcherStatusWorker-C63exuwm.js", "/assets/config-zxJQ3bqG.js"], "css": [] }, "routes/dispatch": { "id": "routes/dispatch", "parentId": "root", "path": "dispatch", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dispatch-DYErx0z4.js", "imports": ["/assets/with-props-CPHBJpbO.js", "/assets/jsx-runtime-BjG_zV1W.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js", "/assets/axios-upsvKRUO.js", "/assets/triangle-alert-Bv_F6sZw.js", "/assets/config-zxJQ3bqG.js"], "css": [] }, "routes/templates": { "id": "routes/templates", "parentId": "root", "path": "templates", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/templates-Cje94REg.js", "imports": ["/assets/with-props-CPHBJpbO.js", "/assets/jsx-runtime-BjG_zV1W.js", "/assets/triangle-alert-Bv_F6sZw.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js", "/assets/config-zxJQ3bqG.js"], "css": [] }, "routes/create_template": { "id": "routes/create_template", "parentId": "root", "path": "create_template", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/create_template-D6MyXflE.js", "imports": ["/assets/with-props-CPHBJpbO.js", "/assets/jsx-runtime-BjG_zV1W.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js", "/assets/react-tooltip.min-CX-i1l2e.js", "/assets/axios-upsvKRUO.js", "/assets/triangle-alert-Bv_F6sZw.js", "/assets/config-zxJQ3bqG.js"], "css": [] }, "routes/template": { "id": "routes/template", "parentId": "root", "path": "template/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/template-CSiVC54H.js", "imports": ["/assets/with-props-CPHBJpbO.js", "/assets/jsx-runtime-BjG_zV1W.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js", "/assets/axios-upsvKRUO.js", "/assets/triangle-alert-Bv_F6sZw.js", "/assets/react-tooltip.min-CX-i1l2e.js", "/assets/config-zxJQ3bqG.js"], "css": [] }, "routes/not_found": { "id": "routes/not_found", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/not_found-v-qfHKEt.js", "imports": ["/assets/with-props-CPHBJpbO.js", "/assets/chunk-K6AXKMTT-BF6vPW5T.js"], "css": [] } }, "url": "/assets/manifest-d4b5a0b5.js", "version": "d4b5a0b5" };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/pending_orders": {
    id: "routes/pending_orders",
    parentId: "root",
    path: "pending_orders",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/dispatch": {
    id: "routes/dispatch",
    parentId: "root",
    path: "dispatch",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/templates": {
    id: "routes/templates",
    parentId: "root",
    path: "templates",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/create_template": {
    id: "routes/create_template",
    parentId: "root",
    path: "create_template",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/template": {
    id: "routes/template",
    parentId: "root",
    path: "template/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/not_found": {
    id: "routes/not_found",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  publicPath,
  routes
};
