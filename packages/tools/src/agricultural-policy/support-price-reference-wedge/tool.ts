import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedSupportPrice: number;
  readonly referencePrice: number;
};
export type Output = { readonly wedge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedSupportPrice: { type: "number" },
    referencePrice: { type: "number" },
  },
  required: ["suppliedSupportPrice", "referencePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wedge: { type: "number" } },
  required: ["wedge"],
} as const;
/** Calculate support price reference wedge from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedSupportPrice, referencePrice } = request;
  const compute = (): Output => {
    return { wedge: suppliedSupportPrice - referencePrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedSupportPrice: 120, referencePrice: 100 },
  output: { wedge: 20 },
} satisfies ToolExample<Input, Output>;
export const supportPriceReferenceWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/support-price-reference-wedge",
    title: "Support Price Reference Wedge Tool",
    description:
      "Calculate support price reference wedge from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedSupportPrice: { type: "number" },
        referencePrice: { type: "number" },
      },
      required: ["suppliedSupportPrice", "referencePrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wedge: { type: "number" } },
      required: ["wedge"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedSupportPrice",
          label: "Supplied Support Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referencePrice",
          label: "Reference Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "wedge", label: "Wedge", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = supportPriceReferenceWedgeTool.execute;
export default supportPriceReferenceWedgeTool;
