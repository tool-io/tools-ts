import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly doorBottomElevation: number;
  readonly substrateElevation: number;
  readonly floorFinishThickness: number;
};
export type Output = {
  readonly finishedFloorElevation: number;
  readonly undercutGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    doorBottomElevation: { type: "number" },
    substrateElevation: { type: "number" },
    floorFinishThickness: { type: "number", minimum: 0 },
  },
  required: [
    "doorBottomElevation",
    "substrateElevation",
    "floorFinishThickness",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    finishedFloorElevation: { type: "number" },
    undercutGap: { type: "number" },
  },
  required: ["finishedFloorElevation", "undercutGap"],
} as const;
/** Subtract an explicit finished-floor elevation from a door-bottom elevation on the same datum without setting clearances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { doorBottomElevation, substrateElevation, floorFinishThickness } =
    request;
  const compute = (): Output => {
    H.domain(floorFinishThickness >= 0, "floorFinishThickness");
    return {
      finishedFloorElevation: substrateElevation + floorFinishThickness,
      undercutGap:
        doorBottomElevation - substrateElevation - floorFinishThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    doorBottomElevation: 30,
    substrateElevation: 0,
    floorFinishThickness: 12,
  },
  output: { finishedFloorElevation: 12, undercutGap: 18 },
} satisfies ToolExample<Input, Output>;
export const doorUndercutFinishFloorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/door-undercut-finish-floor-gap",
    title: "Door Undercut Finish Floor Gap",
    description:
      "Subtract an explicit finished-floor elevation from a door-bottom elevation on the same datum without setting clearances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        doorBottomElevation: { type: "number" },
        substrateElevation: { type: "number" },
        floorFinishThickness: { type: "number", minimum: 0 },
      },
      required: [
        "doorBottomElevation",
        "substrateElevation",
        "floorFinishThickness",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        finishedFloorElevation: { type: "number" },
        undercutGap: { type: "number" },
      },
      required: ["finishedFloorElevation", "undercutGap"],
    },
    ports: {
      inputs: [
        {
          id: "doorBottomElevation",
          label: "Door Bottom Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "substrateElevation",
          label: "Substrate Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "floorFinishThickness",
          label: "Floor Finish Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "finishedFloorElevation",
          label: "Finished Floor Elevation",
          valueType: { type: "number" },
        },
        {
          id: "undercutGap",
          label: "Undercut Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = doorUndercutFinishFloorGapTool.execute;
export default doorUndercutFinishFloorGapTool;
