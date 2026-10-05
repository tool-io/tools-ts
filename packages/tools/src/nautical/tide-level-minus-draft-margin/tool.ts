import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chartedDepthMeters: number;
  readonly tideHeightMeters: number;
  readonly vesselDraftMeters: number;
};
export type Output = { readonly underKeelClearanceMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chartedDepthMeters: { type: "number" },
    tideHeightMeters: { type: "number" },
    vesselDraftMeters: { type: "number" },
  },
  required: ["chartedDepthMeters", "tideHeightMeters", "vesselDraftMeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { underKeelClearanceMeters: { type: "number" } },
  required: ["underKeelClearanceMeters"],
} as const;
/** Compute static under-keel clearance from charted depth and tide on the same datum, excluding squat, waves, and safety allowances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chartedDepthMeters, tideHeightMeters, vesselDraftMeters } = request;
  const compute = (): Output => {
    H.domain(vesselDraftMeters >= 0, "vesselDraftMeters");
    return {
      underKeelClearanceMeters:
        chartedDepthMeters + tideHeightMeters - vesselDraftMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chartedDepthMeters: 4, tideHeightMeters: 1.5, vesselDraftMeters: 3 },
  output: { underKeelClearanceMeters: 2.5 },
} satisfies ToolExample<Input, Output>;
export const tideLevelMinusDraftMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/tide-level-minus-draft-margin",
    title: "Tide Level Minus Draft Margin Tool",
    description:
      "Compute static under-keel clearance from charted depth and tide on the same datum, excluding squat, waves, and safety allowances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chartedDepthMeters: { type: "number" },
        tideHeightMeters: { type: "number" },
        vesselDraftMeters: { type: "number" },
      },
      required: ["chartedDepthMeters", "tideHeightMeters", "vesselDraftMeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { underKeelClearanceMeters: { type: "number" } },
      required: ["underKeelClearanceMeters"],
    },
    ports: {
      inputs: [
        {
          id: "chartedDepthMeters",
          label: "Charted Depth Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tideHeightMeters",
          label: "Tide Height Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vesselDraftMeters",
          label: "Vessel Draft Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "underKeelClearanceMeters",
          label: "Under Keel Clearance Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tideLevelMinusDraftMarginTool.execute;
export default tideLevelMinusDraftMarginTool;
