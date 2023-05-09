import type { LinksFunction, V2_MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { Navbar } from "./components/navbar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const meta: V2_MetaFunction = () => {
  return [{ title: "Graphabase - Remix Demo" }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        <main className="grid grid-cols-5">
          <Navbar />
          <section className="col-span-5 md:col-span-4">
            <Outlet />
          </section>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
