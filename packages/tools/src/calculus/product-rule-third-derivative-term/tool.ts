import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly f: number;
  readonly df: number;
  readonly ddf: number;
  readonly dddf: number;
  readonly g: number;
  readonly dg: number;
  readonly ddg: number;
  readonly dddg: number;
};
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    f: { type: "number" },
    df: { type: "number" },
    ddf: { type: "number" },
    dddf: { type: "number" },
    g: { type: "number" },
    dg: { type: "number" },
    ddg: { type: "number" },
    dddg: { type: "number" },
  },
  required: ["f", "df", "ddf", "dddf", "g", "dg", "ddg", "dddg"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate product rule third derivative term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { f, df, ddf, dddf, g, dg, ddg, dddg } = input;
  const compute = (): Output => {
    return { derivative: dddf * g + 3 * ddf * dg + 3 * df * ddg + f * dddg };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { f: 2, df: 3, ddf: 4, dddf: 5, g: 6, dg: 7, ddg: 8, dddg: 9 },
  output: { derivative: 204 },
} satisfies ToolExample<Input, Output>;
export const productRuleThirdDerivativeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/product-rule-third-derivative-term",
    title: "Product Rule Third Derivative Term Tool",
    description:
      "Calculate product rule third derivative term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        f: { type: "number" },
        df: { type: "number" },
        ddf: { type: "number" },
        dddf: { type: "number" },
        g: { type: "number" },
        dg: { type: "number" },
        ddg: { type: "number" },
        dddg: { type: "number" },
      },
      required: ["f", "df", "ddf", "dddf", "g", "dg", "ddg", "dddg"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { derivative: { type: "number" } },
      required: ["derivative"],
    },
    ports: {
      inputs: [
        { id: "f", label: "F", required: true, valueType: { type: "number" } },
        {
          id: "df",
          label: "Df",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ddf",
          label: "Ddf",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dddf",
          label: "Dddf",
          required: true,
          valueType: { type: "number" },
        },
        { id: "g", label: "G", required: true, valueType: { type: "number" } },
        {
          id: "dg",
          label: "Dg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ddg",
          label: "Ddg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dddg",
          label: "Dddg",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "derivative",
          label: "Derivative",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = productRuleThirdDerivativeTermTool.execute;
export default productRuleThirdDerivativeTermTool;
