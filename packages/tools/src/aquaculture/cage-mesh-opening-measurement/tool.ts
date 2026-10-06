import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPitchMillimeters: number;
  readonly strandWidthMillimeters: number;
};
export type Output = {
  readonly clearOpeningMillimeters: number;
  readonly squareOpeningAreaSquareMillimeters: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPitchMillimeters: { type: "number" },
    strandWidthMillimeters: { type: "number", minimum: 0 },
  },
  required: ["measuredPitchMillimeters", "strandWidthMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clearOpeningMillimeters: { type: "number" },
    squareOpeningAreaSquareMillimeters: { type: "number" },
  },
  required: ["clearOpeningMillimeters", "squareOpeningAreaSquareMillimeters"],
} as const;
/** Describe a square cage mesh opening from center-to-center strand pitch and strand width, without selecting a species-specific mesh size. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPitchMillimeters, strandWidthMillimeters } = request;
  const compute = (): Output => {
    H.domain(
      measuredPitchMillimeters >= strandWidthMillimeters &&
        strandWidthMillimeters >= 0,
      "measuredPitchMillimeters",
    );
    return (() => {
      const clearOpeningMillimeters =
        measuredPitchMillimeters - strandWidthMillimeters;
      return {
        clearOpeningMillimeters,
        squareOpeningAreaSquareMillimeters: clearOpeningMillimeters ** 2,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPitchMillimeters: 20, strandWidthMillimeters: 2 },
  output: {
    clearOpeningMillimeters: 18,
    squareOpeningAreaSquareMillimeters: 324,
  },
} satisfies ToolExample<Input, Output>;
export const cageMeshOpeningMeasurementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/cage-mesh-opening-measurement",
    title: "Cage Mesh Opening Measurement",
    description:
      "Describe a square cage mesh opening from center-to-center strand pitch and strand width, without selecting a species-specific mesh size.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPitchMillimeters: { type: "number" },
        strandWidthMillimeters: { type: "number", minimum: 0 },
      },
      required: ["measuredPitchMillimeters", "strandWidthMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clearOpeningMillimeters: { type: "number" },
        squareOpeningAreaSquareMillimeters: { type: "number" },
      },
      required: [
        "clearOpeningMillimeters",
        "squareOpeningAreaSquareMillimeters",
      ],
    },
    ports: {
      inputs: [
        {
          id: "measuredPitchMillimeters",
          label: "Measured Pitch Millimeters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "strandWidthMillimeters",
          label: "Strand Width Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "clearOpeningMillimeters",
          label: "Clear Opening Millimeters",
          valueType: { type: "number" },
        },
        {
          id: "squareOpeningAreaSquareMillimeters",
          label: "Square Opening Area Square Millimeters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cageMeshOpeningMeasurementTool.execute;
export default cageMeshOpeningMeasurementTool;
