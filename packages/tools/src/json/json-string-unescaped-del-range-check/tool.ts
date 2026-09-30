import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scalar: number };
export type Output = { readonly allowedUnescaped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scalar: { type: "integer" } },
  required: ["scalar"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allowedUnescaped: { type: "boolean" } },
  required: ["allowedUnescaped"],
} as const;
/** Calculate json string unescaped del range check from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { scalar } = input;
  const compute = (): Output => {
    H.codePoint(scalar);
    return { allowedUnescaped: scalar >= 32 && scalar !== 34 && scalar !== 92 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { scalar: 127 },
  output: { allowedUnescaped: true },
} satisfies ToolExample<Input, Output>;
export const jsonStringUnescapedDelRangeCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-string-unescaped-del-range-check",
    title: "JSON String Unescaped Del Range Check Tool",
    description:
      "Calculate json string unescaped del range check from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scalar: { type: "integer" } },
      required: ["scalar"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allowedUnescaped: { type: "boolean" } },
      required: ["allowedUnescaped"],
    },
    ports: {
      inputs: [
        {
          id: "scalar",
          label: "Scalar",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "allowedUnescaped",
          label: "Allowed Unescaped",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = jsonStringUnescapedDelRangeCheckTool.execute;
export default jsonStringUnescapedDelRangeCheckTool;
