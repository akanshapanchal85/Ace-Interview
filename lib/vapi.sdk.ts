import Vapi from '@vapi-ai/web';

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
if (!token) {
  throw new Error(
    "Missing NEXT_PUBLIC_VAPI_WEB_TOKEN. Add it to .env.local and restart the dev server."
  );
}

export const vapi = new Vapi(token);
