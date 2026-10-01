import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frameCenter: number;
  readonly suppliedPupilCoordinate: number;
  readonly referenceDecentration: number;
};
export type Output = {
  readonly decentration: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameCenter: { type: "number" },
    suppliedPupilCoordinate: { type: "number" },
    referenceDecentration: { type: "number" },
  },
  required: ["frameCenter", "suppliedPupilCoordinate", "referenceDecentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decentration: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["decentration", "referenceGap"],
} as const;
/** Compare supplied bench frame and pupil coordinates in one axis basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frameCenter, suppliedPupilCoordinate, referenceDecentration } =
    request;
  const compute = (): Output => {
    return {
      decentration: frameCenter - suppliedPupilCoordinate,
      referenceGap:
        frameCenter - suppliedPupilCoordinate - referenceDecentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    frameCenter: 35,
    suppliedPupilCoordinate: 30,
    referenceDecentration: 4,
  },
  output: { decentration: 5, referenceGap: 1 },
} satisfies ToolExample<Input, Output>;
export const frameDecentrationReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/frame-decentration-reference-gap",
    title: "Frame Decentration Reference Gap Tool",
    description:
      "Compare supplied bench frame and pupil coordinates in one axis basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frameCenter: { type: "number" },
        suppliedPupilCoordinate: { type: "number" },
        referenceDecentration: { type: "number" },
      },
      required: [
        "frameCenter",
        "suppliedPupilCoordinate",
        "referenceDecentration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        decentration: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["decentration", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "frameCenter",
          label: "Frame Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPupilCoordinate",
          label: "Supplied Pupil Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDecentration",
          label: "Reference Decentration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "decentration",
          label: "Decentration",
          valueType: { type: "number" },
        },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = frameDecentrationReferenceGapTool.execute;
export default frameDecentrationReferenceGapTool;
