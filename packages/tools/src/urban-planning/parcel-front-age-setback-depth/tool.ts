import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parcelDepth: number;
  readonly frontSetback: number;
  readonly rearSetback: number;
};
export type Output = {
  readonly buildableDepth: number;
  readonly fits: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parcelDepth: { type: "number", minimum: 0 },
    frontSetback: { type: "number", minimum: 0 },
    rearSetback: { type: "number", minimum: 0 },
  },
  required: ["parcelDepth", "frontSetback", "rearSetback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { buildableDepth: { type: "number" }, fits: { type: "boolean" } },
  required: ["buildableDepth", "fits"],
} as const;
/** Subtract explicitly supplied front and rear setbacks from a rectangular parcel depth, without selecting zoning rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parcelDepth, frontSetback, rearSetback } = request;
  const compute = (): Output => {
    H.domain(
      parcelDepth >= 0 && frontSetback >= 0 && rearSetback >= 0,
      "parcelDepth",
    );
    return {
      buildableDepth: parcelDepth - frontSetback - rearSetback,
      fits: parcelDepth >= frontSetback + rearSetback,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parcelDepth: 40, frontSetback: 6, rearSetback: 4 },
  output: { buildableDepth: 30, fits: true },
} satisfies ToolExample<Input, Output>;
export const parcelFrontAgeSetbackDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-planning/parcel-front-age-setback-depth",
    title: "Parcel Frontage Setback Depth Tool",
    description:
      "Subtract explicitly supplied front and rear setbacks from a rectangular parcel depth, without selecting zoning rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parcelDepth: { type: "number", minimum: 0 },
        frontSetback: { type: "number", minimum: 0 },
        rearSetback: { type: "number", minimum: 0 },
      },
      required: ["parcelDepth", "frontSetback", "rearSetback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        buildableDepth: { type: "number" },
        fits: { type: "boolean" },
      },
      required: ["buildableDepth", "fits"],
    },
    ports: {
      inputs: [
        {
          id: "parcelDepth",
          label: "Parcel Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "frontSetback",
          label: "Front Setback",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rearSetback",
          label: "Rear Setback",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "buildableDepth",
          label: "Buildable Depth",
          valueType: { type: "number" },
        },
        { id: "fits", label: "Fits", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = parcelFrontAgeSetbackDepthTool.execute;
export default parcelFrontAgeSetbackDepthTool;
