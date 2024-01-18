import { LoaderFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, json, useLoaderData } from "@remix-run/react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const loader: LoaderFunction = async () => {
  return json({
    ENV: {
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    },
  });
};

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GoogleReCaptchaProvider
          reCaptchaKey={ENV.RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: false,
            defer: true,
            appendTo: "head",
            nonce: undefined,
          }}
        >
          <Outlet />
        </GoogleReCaptchaProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
