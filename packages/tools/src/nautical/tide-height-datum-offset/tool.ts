import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heightAboveSource: number;
  readonly sourceDatumElevation: number;
  readonly targetDatumElevation: number;
};
export type Output = { readonly heightAboveTarget: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heightAboveSource: { type: "number" },
    sourceDatumElevation: { type: "number" },
    targetDatumElevation: { type: "number" },
  },
  required: [
    "heightAboveSource",
    "sourceDatumElevation",
    "targetDatumElevation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heightAboveTarget: { type: "number" } },
  required: ["heightAboveTarget"],
} as const;
/** Translate a supplied tide height between vertical datums with elevations in one common reference; no tide prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { heightAboveSource, sourceDatumElevation, targetDatumElevation } =
    request;
  const compute = (): Output => {
    return {
      heightAboveTarget:
        heightAboveSource + sourceDatumElevation - targetDatumElevation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    heightAboveSource: 3,
    sourceDatumElevation: 1,
    targetDatumElevation: 2,
  },
  output: { heightAboveTarget: 2 },
} satisfies ToolExample<Input, Output>;
export const tideHeightDatumOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/tide-height-datum-offset",
    title: "Tide Height Datum Offset Tool",
    description:
      "Translate a supplied tide height between vertical datums with elevations in one common reference; no tide prediction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heightAboveSource: { type: "number" },
        sourceDatumElevation: { type: "number" },
        targetDatumElevation: { type: "number" },
      },
      required: [
        "heightAboveSource",
        "sourceDatumElevation",
        "targetDatumElevation",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heightAboveTarget: { type: "number" } },
      required: ["heightAboveTarget"],
    },
    ports: {
      inputs: [
        {
          id: "heightAboveSource",
          label: "Height Above Source",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceDatumElevation",
          label: "Source Datum Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetDatumElevation",
          label: "Target Datum Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "heightAboveTarget",
          label: "Height Above Target",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tideHeightDatumOffsetTool.execute;
export default tideHeightDatumOffsetTool;
