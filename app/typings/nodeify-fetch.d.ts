declare module "nodeify-fetch" {
  interface FetchOptions extends RequestInit {
    compress?: boolean;
  }

  interface FetchFunction {
    (
      url: string | URL | globalThis.Request,
      init?: FetchOptions
    ): Promise<globalThis.Response>;
    Headers: typeof globalThis.Headers;
    Request: typeof globalThis.Request;
    Response: typeof globalThis.Response;
  }

  const fetch: FetchFunction;
  export = fetch;
}
