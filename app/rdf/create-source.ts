import { Source } from "rdf-cube-view-query";
import rdf from "rdf-ext";
import { ParsingClient } from "@/lib/sparql-client";

export const pragmas = `#pragma describe.strategy cbd
#pragma join.hash off
`;

export const createSource = (
  sparqlClient: ParsingClient,
  queryPrefix?: string
) => {
  return new Source({
    client: sparqlClient,
    queryOperation: "postUrlencoded",
    queryPrefix,
    sourceGraph: rdf.defaultGraph(),
  });
};
