import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly prefix: string };
export type Output = {
  readonly mainEnumeration: string;
  readonly supplementIndex: number;
  readonly hasSupplement: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    prefix: { type: "string", maxLength: 8192 },
  },
  required: ["token", "prefix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mainEnumeration: { type: "string", maxLength: 8192 },
    supplementIndex: { type: "integer" },
    hasSupplement: { type: "boolean" },
  },
  required: ["mainEnumeration", "supplementIndex", "hasSupplement"],
} as const;
/** Read one explicit serial supplement suffix without assuming a cataloguing standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, prefix } = request;
  const compute = (): Output => {
    H.domain(prefix.length > 0);
    const i = token.lastIndexOf(prefix);
    if (i < 0)
      return {
        mainEnumeration: token,
        supplementIndex: 0,
        hasSupplement: false,
      };
    const digits = token.slice(i + prefix.length);
    H.domain(/^[1-9][0-9]*(?![\s\S])/.test(digits));
    const supplementIndex = Number(digits);
    H.integer(supplementIndex, 1);
    return {
      mainEnumeration: token.slice(0, i),
      supplementIndex,
      hasSupplement: true,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "12-S2", prefix: "-S" },
  output: { mainEnumeration: "12", supplementIndex: 2, hasSupplement: true },
} satisfies ToolExample<Input, Output>;
export const serialEnumerationSupplementIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/serial-enumeration-supplement-index",
    title: "Serial Enumeration Supplement Index Tool",
    description:
      "Read one explicit serial supplement suffix without assuming a cataloguing standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        prefix: { type: "string", maxLength: 8192 },
      },
      required: ["token", "prefix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mainEnumeration: { type: "string", maxLength: 8192 },
        supplementIndex: { type: "integer" },
        hasSupplement: { type: "boolean" },
      },
      required: ["mainEnumeration", "supplementIndex", "hasSupplement"],
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
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "mainEnumeration",
          label: "Main Enumeration",
          valueType: { type: "string" },
        },
        {
          id: "supplementIndex",
          label: "Supplement Index",
          valueType: { type: "integer" },
        },
        {
          id: "hasSupplement",
          label: "Has Supplement",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = serialEnumerationSupplementIndexTool.execute;
export default serialEnumerationSupplementIndexTool;
