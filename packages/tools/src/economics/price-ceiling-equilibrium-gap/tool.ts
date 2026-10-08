import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedPriceCeiling: number;
  readonly suppliedEquilibriumPrice: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedPriceCeiling: { type: "number" },
    suppliedEquilibriumPrice: { type: "number" },
  },
  required: ["suppliedPriceCeiling", "suppliedEquilibriumPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit price ceiling from a supplied equilibrium price without solving market equilibrium or predicting shortages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedPriceCeiling, suppliedEquilibriumPrice } = request;
  const compute = (): Output => {
    return { signedGap: suppliedEquilibriumPrice - suppliedPriceCeiling };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedPriceCeiling: 12, suppliedEquilibriumPrice: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const priceCeilingEquilibriumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economics"],
      keywords: ["economics"],
    },
    id: "economics/price-ceiling-equilibrium-gap",
    title: "Price Ceiling Equilibrium Gap",
    description:
      "Subtract an explicit price ceiling from a supplied equilibrium price without solving market equilibrium or predicting shortages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedPriceCeiling: { type: "number" },
        suppliedEquilibriumPrice: { type: "number" },
      },
      required: ["suppliedPriceCeiling", "suppliedEquilibriumPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedPriceCeiling",
          label: "Supplied Price Ceiling",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEquilibriumPrice",
          label: "Supplied Equilibrium Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = priceCeilingEquilibriumGapTool.execute;
export default priceCeilingEquilibriumGapTool;
