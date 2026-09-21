import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leading: number; readonly constant: number };
export type Output = { readonly product: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leading: { type: "number" }, constant: { type: "number" } },
  required: ["leading", "constant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { product: { type: "number" } },
  required: ["product"],
} as const;
/** Calculate quartic root product from coefficients from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leading, constant } = input;
  const compute = (): Output => {
    H.domain(leading !== 0);
    return { product: constant / leading };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leading: 2, constant: 12 },
  output: { product: 6 },
} satisfies ToolExample<Input, Output>;
export const quarticRootProductFromCoefficientsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/quartic-root-product-from-coefficients",
    title: "Quartic Root Product From Coefficients Tool",
    description:
      "Calculate quartic root product from coefficients from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { leading: { type: "number" }, constant: { type: "number" } },
      required: ["leading", "constant"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { product: { type: "number" } },
      required: ["product"],
    },
    ports: {
      inputs: [
        {
          id: "leading",
          label: "Leading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "constant",
          label: "Constant",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "product", label: "Product", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = quarticRootProductFromCoefficientsTool.execute;
export default quarticRootProductFromCoefficientsTool;
