import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly suppliedStopwords: readonly string[];
  readonly removeListed: boolean;
};
export type Output = { readonly listed: boolean; readonly retained: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    suppliedStopwords: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    removeListed: { type: "boolean" },
  },
  required: ["token", "suppliedStopwords", "removeListed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { listed: { type: "boolean" }, retained: { type: "boolean" } },
  required: ["listed", "retained"],
} as const;
/** Apply an explicit exact-token stopword policy without language detection, case folding, or tokenization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, suppliedStopwords, removeListed } = request;
  const compute = (): Output => {
    return {
      listed: suppliedStopwords.includes(token),
      retained: !removeListed || !suppliedStopwords.includes(token),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "the", suppliedStopwords: ["the", "a"], removeListed: true },
  output: { listed: true, retained: false },
} satisfies ToolExample<Input, Output>;
export const queryStopwordPolicyFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "information-science",
        "information science",
        "information and language sciences",
      ],
      keywords: ["information science", "information and language sciences"],
    },
    id: "information-science/query-stopword-policy-flag",
    title: "Query Stopword Policy Flag",
    description:
      "Apply an explicit exact-token stopword policy without language detection, case folding, or tokenization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        suppliedStopwords: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        removeListed: { type: "boolean" },
      },
      required: ["token", "suppliedStopwords", "removeListed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listed: { type: "boolean" },
        retained: { type: "boolean" },
      },
      required: ["listed", "retained"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedStopwords",
          label: "Supplied Stopwords",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "removeListed",
          label: "Remove Listed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "listed", label: "Listed", valueType: { type: "boolean" } },
        { id: "retained", label: "Retained", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = queryStopwordPolicyFlagTool.execute;
export default queryStopwordPolicyFlagTool;
