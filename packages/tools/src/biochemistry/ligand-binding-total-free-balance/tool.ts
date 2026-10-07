import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalLigand: number;
  readonly freeLigand: number;
};
export type Output = { readonly boundLigand: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalLigand: { type: "number", minimum: 0 },
    freeLigand: { type: "number", minimum: 0 },
  },
  required: ["totalLigand", "freeLigand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { boundLigand: { type: "number" } },
  required: ["boundLigand"],
} as const;
/** Subtract supplied free from total ligand on a shared concentration basis, preserving inconsistent negative balances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalLigand, freeLigand } = request;
  const compute = (): Output => {
    H.domain(totalLigand >= 0, "totalLigand");
    H.domain(freeLigand >= 0, "freeLigand");
    return { boundLigand: totalLigand - freeLigand };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalLigand: 12, freeLigand: 5 },
  output: { boundLigand: 7 },
} satisfies ToolExample<Input, Output>;
export const ligandBindingTotalFreeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/ligand-binding-total-free-balance",
    title: "Ligand Binding Total Free Balance",
    description:
      "Subtract supplied free from total ligand on a shared concentration basis, preserving inconsistent negative balances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalLigand: { type: "number", minimum: 0 },
        freeLigand: { type: "number", minimum: 0 },
      },
      required: ["totalLigand", "freeLigand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { boundLigand: { type: "number" } },
      required: ["boundLigand"],
    },
    ports: {
      inputs: [
        {
          id: "totalLigand",
          label: "Total Ligand",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freeLigand",
          label: "Free Ligand",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "boundLigand",
          label: "Bound Ligand",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ligandBindingTotalFreeBalanceTool.execute;
export default ligandBindingTotalFreeBalanceTool;
