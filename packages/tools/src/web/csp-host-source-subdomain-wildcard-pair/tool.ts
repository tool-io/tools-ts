import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly source: string; readonly host: string };
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    host: { type: "string", maxLength: 8192 },
  },
  required: ["source", "host"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Check only a lowercase ASCII host subdomain wildcard; scheme, port and path matching are outside this fragment. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { source, host } = input;
  const compute = (): Output => {
    H.domain(
      /^\*\.[a-z0-9-]+(?:\.[a-z0-9-]+)*(?![\s\S])/.test(source) &&
        /^[a-z0-9-]+(?:\.[a-z0-9-]+)*(?![\s\S])/.test(host),
    );
    const suffix = source.slice(1);
    return { matches: host.endsWith(suffix) && host.length > suffix.length };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { source: "*.example.com", host: "a.example.com" },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const cspHostSourceSubdomainWildcardPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/csp-host-source-subdomain-wildcard-pair",
    title: "CSP Host Source Subdomain Wildcard Pair Tool",
    description:
      "Check only a lowercase ASCII host subdomain wildcard; scheme, port and path matching are outside this fragment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: { type: "string", maxLength: 8192 },
        host: { type: "string", maxLength: 8192 },
      },
      required: ["source", "host"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "host",
          label: "Host",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cspHostSourceSubdomainWildcardPairTool.execute;
export default cspHostSourceSubdomainWildcardPairTool;
