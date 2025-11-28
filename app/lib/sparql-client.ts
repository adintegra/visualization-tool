import baseFetch from "nodeify-fetch";
import BaseStreamClient from "sparql-http-client";
import BaseParsingClient from "sparql-http-client/ParsingClient";

export { default as ResultParser } from "sparql-http-client/ResultParser";
export type { ResultRow } from "sparql-http-client/ResultParser";

type StreamClientOptions = ConstructorParameters<typeof BaseStreamClient>[0];
type ParsingClientOptions = ConstructorParameters<typeof BaseParsingClient>[0];

/**
 * Determines whether HTTP compression should be enabled for SPARQL queries.
 * Controlled by the SPARQL_HTTP_COMPRESS environment variable.
 * Defaults to false (compression disabled) to maintain current behavior.
 */
const shouldCompress =
  process.env.SPARQL_HTTP_COMPRESS === "true" ||
  process.env.SPARQL_HTTP_COMPRESS === "1";

const createFetchWithCompressionSetting = ((
  url: string | URL | globalThis.Request,
  init?: Parameters<typeof baseFetch>[1]
) => {
  const finalInit =
    typeof init === "object" && init !== null
      ? { compress: shouldCompress, ...init }
      : { compress: shouldCompress };

  return baseFetch(url, finalInit);
}) as typeof baseFetch;

createFetchWithCompressionSetting.Headers = baseFetch.Headers;
createFetchWithCompressionSetting.Request = baseFetch.Request;
createFetchWithCompressionSetting.Response = baseFetch.Response;

export class StreamClient extends BaseStreamClient {
  constructor(options?: StreamClientOptions) {
    // @ts-expect-error - Type mismatch between BaseQuad and Quad variants is safe at runtime
    super({
      ...options,
      fetch: options?.fetch ?? createFetchWithCompressionSetting,
    });
  }
}

export class ParsingClient extends BaseParsingClient {
  constructor(options?: ParsingClientOptions) {
    // @ts-expect-error - Type mismatch between BaseQuad and Quad variants is safe at runtime
    super({
      ...options,
      fetch: options?.fetch ?? createFetchWithCompressionSetting,
    });
  }
}

export default StreamClient;
