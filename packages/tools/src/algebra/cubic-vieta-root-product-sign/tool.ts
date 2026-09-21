import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly leading: number; readonly constant: number };
export type Output = { readonly product: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leading: { type: "number" }, constant: { type: "number" } },
  required: ["leading", "constant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { product: { type: "number" }, sign: { type: "integer" } },
  required: ["product", "sign"],
} as const;
/** Compute cubic vieta root product sign from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leading, constant } = input;
  const compute = (): Output => {
    domain(leading !== 0);
    const product = -constant / leading;
    return {
      product: product === 0 ? 0 : product,
      sign: Math.sign(product) || 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leading: 2, constant: -12 },
  output: { product: 6, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const cubicVietaRootProductSignTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/cubic-vieta-root-product-sign",
  title: "Cubic Vieta Root Product Sign Tool",
  description:
    "Compute cubic vieta root product sign from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
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
      { id: "sign", label: "Sign", valueType: { type: "integer" } },
    ],
  },
});
export const run = cubicVietaRootProductSignTool.execute;
export default cubicVietaRootProductSignTool;
