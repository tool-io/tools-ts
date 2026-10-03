import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bidBeforeTax: number;
  readonly tax: number;
  readonly bondRate: number;
  readonly includeTax: boolean;
};
export type Output = { readonly base: number; readonly bond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bidBeforeTax: { type: "number", minimum: 0 },
    tax: { type: "number", minimum: 0 },
    bondRate: { type: "number", minimum: 0, maximum: 1 },
    includeTax: { type: "boolean" },
  },
  required: ["bidBeforeTax", "tax", "bondRate", "includeTax"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { base: { type: "number" }, bond: { type: "number" } },
  required: ["base", "bond"],
} as const;
/** Calculate procurement bid bond percentage base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bidBeforeTax, tax, bondRate, includeTax } = request;
  const compute = (): Output => {
    H.domain(bidBeforeTax >= 0 && tax >= 0);
    H.probability(bondRate);
    return {
      base: bidBeforeTax + (includeTax ? tax : 0),
      bond: (bidBeforeTax + (includeTax ? tax : 0)) * bondRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bidBeforeTax: 1000, tax: 100, bondRate: 0.05, includeTax: true },
  output: { base: 1100, bond: 55 },
} satisfies ToolExample<Input, Output>;
export const procurementBidBondPercentageBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/procurement-bid-bond-percentage-base",
    title: "Procurement Bid Bond Percentage Base Tool",
    description:
      "Calculate procurement bid bond percentage base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bidBeforeTax: { type: "number", minimum: 0 },
        tax: { type: "number", minimum: 0 },
        bondRate: { type: "number", minimum: 0, maximum: 1 },
        includeTax: { type: "boolean" },
      },
      required: ["bidBeforeTax", "tax", "bondRate", "includeTax"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { base: { type: "number" }, bond: { type: "number" } },
      required: ["base", "bond"],
    },
    ports: {
      inputs: [
        {
          id: "bidBeforeTax",
          label: "Bid Before Tax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tax",
          label: "Tax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bondRate",
          label: "Bond Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeTax",
          label: "Include Tax",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "base", label: "Base", valueType: { type: "number" } },
        { id: "bond", label: "Bond", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = procurementBidBondPercentageBaseTool.execute;
export default procurementBidBondPercentageBaseTool;
