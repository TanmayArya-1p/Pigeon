import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("pending_orders", "routes/pending_orders.jsx"),
    route("dispatch", "routes/dispatch.jsx"),
    route("templates", "routes/templates.jsx"),
    route("create_template", "routes/create_template.jsx"),
    route("template/:id", "routes/template.jsx"),

    route("*", "routes/not_found.jsx"),


] satisfies RouteConfig;


    // route("dispatch_single", "routes/dispatch_single.jsx"),
    // route("dispatch_campaign", "routes/dispatch_campaign.jsx"),
    // route("templates", "routes/templates.jsx"),
    // route("webhooks", "routes/webhooks.jsx"),
    // route("template/:templateid", "routes/template.jsx"),