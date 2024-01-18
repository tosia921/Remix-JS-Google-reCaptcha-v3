import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
/**
 * This file contains the implementation of the Index component, which serves as the main page of the Remix app.
 * It includes form submission logic, reCAPTCHA integration, and form validation.
 */

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import "~/styles.css";
import { getRecaptchaScore } from "~/utils/getRecaptchaScore";

/**
 * Retrieves the metadata for the Index page.
 * @returns An array of metadata objects containing the page title and description.
 */
export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

/**
 * Handles the form submission action.
 * @param request - The request object containing the form data.
 * @returns A response object indicating the success or failure of the form submission.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  // for (const [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }

  // form validation logic here

  const token = formData.get("_captcha") as string;
  const key = process.env.RECAPTCHA_SECRET_KEY as string;
  const recaptchaResult = await getRecaptchaScore(token, key);
  console.log(recaptchaResult);

  if (!recaptchaResult) {
    // your contact form submission code here

    return redirect("/thank-you");
  }

  return json({ message: "You are a robot!" });
};

/**
 * The main component for the Index page.
 * It handles reCAPTCHA verification, form submission, and rendering of the form.
 */
export default function Index() {
  const actionData = useActionData<typeof action>();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  /**
   * Handles the reCAPTCHA verification process.
   * @returns A promise that resolves with the reCAPTCHA token.
   */
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha("yourAction");
    setCaptchaToken(token);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  return (
    <div className="page_wrapper">
      <Form method="post" className="form">
        {captchaToken ? <input type="hidden" name="_captcha" value={captchaToken}></input> : null}
        <div className="form_field">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>

        <button type="submit" onSubmit={() => handleReCaptchaVerify}>
          Submit
        </button>
        {actionData?.message ? <p>{actionData.message}</p> : null}
      </Form>
    </div>
  );
}
