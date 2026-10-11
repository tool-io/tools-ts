import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceWaterElevation: number;
  readonly outletElevation: number;
  readonly suppliedRequiredHead: number;
};
export type Output = {
  readonly availableHead: number;
  readonly headMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceWaterElevation: { type: "number" },
    outletElevation: { type: "number" },
    suppliedRequiredHead: { type: "number", minimum: 0 },
  },
  required: ["sourceWaterElevation", "outletElevation", "suppliedRequiredHead"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableHead: { type: "number" },
    headMargin: { type: "number" },
  },
  required: ["availableHead", "headMargin"],
} as const;
/** Compare explicit elevation head with a supplied required head without calculating friction or assessing structural safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceWaterElevation, outletElevation, suppliedRequiredHead } =
    request;
  const compute = (): Output => {
    H.domain(suppliedRequiredHead >= 0, "suppliedRequiredHead");
    return {
      availableHead: sourceWaterElevation - outletElevation,
      headMargin: sourceWaterElevation - outletElevation - suppliedRequiredHead,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceWaterElevation: 8,
    outletElevation: 3,
    suppliedRequiredHead: 2,
  },
  output: { availableHead: 5, headMargin: 3 },
} satisfies ToolExample<Input, Output>;
export const roofGardenGravityHeadMarginTool = H.defineSchemaCalculation<
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
    id: "permaculture/roof-garden-gravity-head-margin",
    title: "Roof Garden Gravity Head Margin",
    description:
      "Compare explicit elevation head with a supplied required head without calculating friction or assessing structural safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceWaterElevation: { type: "number" },
        outletElevation: { type: "number" },
        suppliedRequiredHead: { type: "number", minimum: 0 },
      },
      required: [
        "sourceWaterElevation",
        "outletElevation",
        "suppliedRequiredHead",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableHead: { type: "number" },
        headMargin: { type: "number" },
      },
      required: ["availableHead", "headMargin"],
    },
    ports: {
      inputs: [
        {
          id: "sourceWaterElevation",
          label: "Source Water Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletElevation",
          label: "Outlet Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRequiredHead",
          label: "Supplied Required Head",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableHead",
          label: "Available Head",
          valueType: { type: "number" },
        },
        {
          id: "headMargin",
          label: "Head Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = roofGardenGravityHeadMarginTool.execute;
export default roofGardenGravityHeadMarginTool;
