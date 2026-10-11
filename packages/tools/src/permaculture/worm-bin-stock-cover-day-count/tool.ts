import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMaterialMass: number;
  readonly suppliedDailyUseMass: number;
};
export type Output = { readonly daysCovered: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMaterialMass: { type: "number", minimum: 0 },
    suppliedDailyUseMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["availableMaterialMass", "suppliedDailyUseMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { daysCovered: { type: "number" } },
  required: ["daysCovered"],
} as const;
/** Divide explicit material stock by supplied positive daily use without recommending feed or estimating worm demand. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMaterialMass, suppliedDailyUseMass } = request;
  const compute = (): Output => {
    H.domain(availableMaterialMass >= 0, "availableMaterialMass");
    (H.domain(suppliedDailyUseMass > 0, "suppliedDailyUseMass"),
      suppliedDailyUseMass);
    return { daysCovered: availableMaterialMass / suppliedDailyUseMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableMaterialMass: 12, suppliedDailyUseMass: 0.5 },
  output: { daysCovered: 24 },
} satisfies ToolExample<Input, Output>;
export const wormBinStockCoverDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["permaculture", "agriculture"],
      keywords: ["permaculture", "agriculture"],
    },
    id: "permaculture/worm-bin-stock-cover-day-count",
    title: "Worm Bin Stock Cover Day Count",
    description:
      "Divide explicit material stock by supplied positive daily use without recommending feed or estimating worm demand.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMaterialMass: { type: "number", minimum: 0 },
        suppliedDailyUseMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["availableMaterialMass", "suppliedDailyUseMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { daysCovered: { type: "number" } },
      required: ["daysCovered"],
    },
    ports: {
      inputs: [
        {
          id: "availableMaterialMass",
          label: "Available Material Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDailyUseMass",
          label: "Supplied Daily Use Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "daysCovered",
          label: "Days Covered",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wormBinStockCoverDayCountTool.execute;
export default wormBinStockCoverDayCountTool;
