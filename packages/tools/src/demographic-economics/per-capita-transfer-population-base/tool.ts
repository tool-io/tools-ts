import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalTransfer: number;
  readonly suppliedPopulation: number;
};
export type Output = { readonly transferPerPerson: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalTransfer: { type: "number" },
    suppliedPopulation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalTransfer", "suppliedPopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { transferPerPerson: { type: "number" } },
  required: ["transferPerPerson"],
} as const;
/** Divide a supplied signed aggregate transfer by an explicit positive population denominator without selecting coverage definitions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalTransfer, suppliedPopulation } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedPopulation) && suppliedPopulation > 0,
      "suppliedPopulation",
    ),
      suppliedPopulation);
    return { transferPerPerson: totalTransfer / suppliedPopulation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalTransfer: 1000, suppliedPopulation: 200 },
  output: { transferPerPerson: 5 },
} satisfies ToolExample<Input, Output>;
export const perCapitaTransferPopulationBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/per-capita-transfer-population-base",
    title: "Per Capita Transfer Population Base Tool",
    description:
      "Divide a supplied signed aggregate transfer by an explicit positive population denominator without selecting coverage definitions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalTransfer: { type: "number" },
        suppliedPopulation: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["totalTransfer", "suppliedPopulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { transferPerPerson: { type: "number" } },
      required: ["transferPerPerson"],
    },
    ports: {
      inputs: [
        {
          id: "totalTransfer",
          label: "Total Transfer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPopulation",
          label: "Supplied Population",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transferPerPerson",
          label: "Transfer Per Person",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = perCapitaTransferPopulationBaseTool.execute;
export default perCapitaTransferPopulationBaseTool;
