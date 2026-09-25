import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: string;
  readonly missingTokens: readonly string[];
  readonly trim: boolean;
  readonly caseSensitive: boolean;
};
export type Output = { readonly missing: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    missingTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    trim: { type: "boolean" },
    caseSensitive: { type: "boolean" },
  },
  required: ["value", "missingTokens", "trim", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missing: { type: "boolean" } },
  required: ["missing"],
} as const;
/** Calculate missingness indicator one cell token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, missingTokens, trim, caseSensitive } = request;
  const compute = (): Output => {
    const norm = (x: string) => {
      const s = trim ? x.trim() : x;
      return caseSensitive ? s : s.toLowerCase();
    };
    return { missing: missingTokens.some((x) => norm(x) === norm(value)) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    value: " NA ",
    missingTokens: ["NA", ""],
    trim: true,
    caseSensitive: false,
  },
  output: { missing: true },
} satisfies ToolExample<Input, Output>;
export const missingnessIndicatorOneCellTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/missingness-indicator-one-cell-token",
    title: "Missingness Indicator One Cell Token Tool",
    description:
      "Calculate missingness indicator one cell token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        missingTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        trim: { type: "boolean" },
        caseSensitive: { type: "boolean" },
      },
      required: ["value", "missingTokens", "trim", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { missing: { type: "boolean" } },
      required: ["missing"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "missingTokens",
          label: "Missing Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "trim",
          label: "Trim",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = missingnessIndicatorOneCellTokenTool.execute;
export default missingnessIndicatorOneCellTokenTool;
