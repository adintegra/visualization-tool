import baseFetch from "nodeify-fetch";
import BaseStreamClient from "sparql-http-client";
import BaseParsingClient from "sparql-http-client/ParsingClient";

export { default as ResultParser } from "sparql-http-client/ResultParser";
export type { ResultRow } from "sparql-http-client/ResultParser";

type StreamClientOptions = ConstructorParameters<typeof BaseStreamClient>[0];
type ParsingClientOptions = ConstructorParameters<typeof BaseParsingClient>[0];

const fetchWithoutCompression: typeof baseFetch = (url, init) => {
  const finalInit =
    typeof init === "object" && init !== null
      ? { compress: false, ...init }
      : { compress: false };

  return baseFetch(url, finalInit);
};

Object.assign(fetchWithoutCompression, {
  Headers: baseFetch.Headers,
  Request: baseFetch.Request,
  Response: baseFetch.Response,
});

const withDefaultFetch = <T extends { fetch?: typeof baseFetch }>(
  options?: T
) => {
  const opts = options ?? ({} as T);
  return {
    ...opts,
    fetch: opts.fetch ?? fetchWithoutCompression,
  };
};

export class StreamClient extends BaseStreamClient {
  constructor(options?: StreamClientOptions) {
    super(withDefaultFetch(options));
  }
}

export class ParsingClient extends BaseParsingClient {
  constructor(options?: ParsingClientOptions) {
    super(withDefaultFetch(options));
  }
}

export default StreamClient;
