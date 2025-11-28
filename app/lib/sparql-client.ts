import baseFetch from "nodeify-fetch";
import BaseStreamClient from "sparql-http-client";
import BaseParsingClient from "sparql-http-client/ParsingClient";

export { default as ResultParser } from "sparql-http-client/ResultParser";
export type { ResultRow } from "sparql-http-client/ResultParser";

type StreamClientOptions = ConstructorParameters<typeof BaseStreamClient>[0];
type ParsingClientOptions = ConstructorParameters<typeof BaseParsingClient>[0];

const fetchWithoutCompression = ((
  url: string | URL | globalThis.Request,
  init?: Parameters<typeof baseFetch>[1]
) => {
  const finalInit =
    typeof init === "object" && init !== null
      ? { compress: false, ...init }
      : { compress: false };

  return baseFetch(url, finalInit);
}) as typeof baseFetch;

fetchWithoutCompression.Headers = baseFetch.Headers;
fetchWithoutCompression.Request = baseFetch.Request;
fetchWithoutCompression.Response = baseFetch.Response;

export class StreamClient extends BaseStreamClient {
  constructor(options?: StreamClientOptions) {
    // @ts-expect-error - Type mismatch between BaseQuad and Quad variants is safe at runtime
    super({
      ...options,
      fetch: options?.fetch ?? fetchWithoutCompression,
    });
  }
}

export class ParsingClient extends BaseParsingClient {
  constructor(options?: ParsingClientOptions) {
    // @ts-expect-error - Type mismatch between BaseQuad and Quad variants is safe at runtime
    super({
      ...options,
      fetch: options?.fetch ?? fetchWithoutCompression,
    });
  }
}

export default StreamClient;
