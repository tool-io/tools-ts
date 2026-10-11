import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalGrowingArea: number;
  readonly rackFootprintArea: number;
};
export type Output = { readonly growingAreaPerFootprint: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalGrowingArea: { type: "number", minimum: 0 },
    rackFootprintArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["totalGrowingArea", "rackFootprintArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { growingAreaPerFootprint: { type: "number" } },
  required: ["growingAreaPerFootprint"],
} as const;
/** Divide explicit total growing area by rack footprint, allowing multiple tiers to produce ratios above one. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalGrowingArea, rackFootprintArea } = request;
  const compute = (): Output => {
    H.domain(totalGrowingArea >= 0, "totalGrowingArea");
    (H.domain(rackFootprintArea > 0, "rackFootprintArea"), rackFootprintArea);
    return { growingAreaPerFootprint: totalGrowingArea / rackFootprintArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalGrowingArea: 24, rackFootprintArea: 4 },
  output: { growingAreaPerFootprint: 6 },
} satisfies ToolExample<Input, Output>;
export const growRackFootprintGrowingAreaRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["vertical-farming", "vertical farming", "agriculture"],
      keywords: ["vertical farming", "agriculture"],
    },
    id: "vertical-farming/grow-rack-footprint-growing-area-ratio",
    title: "Grow Rack Footprint Growing Area Ratio",
    description:
      "Divide explicit total growing area by rack footprint, allowing multiple tiers to produce ratios above one.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalGrowingArea: { type: "number", minimum: 0 },
        rackFootprintArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["totalGrowingArea", "rackFootprintArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { growingAreaPerFootprint: { type: "number" } },
      required: ["growingAreaPerFootprint"],
    },
    ports: {
      inputs: [
        {
          id: "totalGrowingArea",
          label: "Total Growing Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rackFootprintArea",
          label: "Rack Footprint Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "growingAreaPerFootprint",
          label: "Growing Area Per Footprint",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growRackFootprintGrowingAreaRatioTool.execute;
export default growRackFootprintGrowingAreaRatioTool;
