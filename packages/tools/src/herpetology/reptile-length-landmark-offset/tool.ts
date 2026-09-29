import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly landmarkCoordinate: number;
  readonly referenceCoordinate: number;
  readonly scale: number;
};
export type Output = { readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    landmarkCoordinate: { type: "number" },
    referenceCoordinate: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["landmarkCoordinate", "referenceCoordinate", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offset: { type: "number" } },
  required: ["offset"],
} as const;
/** Apply an explicit same-axis image landmark calibration without species norms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { landmarkCoordinate, referenceCoordinate, scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return { offset: (landmarkCoordinate - referenceCoordinate) * scale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { landmarkCoordinate: 120, referenceCoordinate: 20, scale: 0.1 },
  output: { offset: 10 },
} satisfies ToolExample<Input, Output>;
export const reptileLengthLandmarkOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/reptile-length-landmark-offset",
    title: "Reptile Length Landmark Offset Tool",
    description:
      "Apply an explicit same-axis image landmark calibration without species norms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        landmarkCoordinate: { type: "number" },
        referenceCoordinate: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["landmarkCoordinate", "referenceCoordinate", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offset: { type: "number" } },
      required: ["offset"],
    },
    ports: {
      inputs: [
        {
          id: "landmarkCoordinate",
          label: "Landmark Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCoordinate",
          label: "Reference Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "offset", label: "Offset", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reptileLengthLandmarkOffsetTool.execute;
export default reptileLengthLandmarkOffsetTool;
