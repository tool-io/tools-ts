import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinate: number;
  readonly origin: number;
  readonly suppliedScale: number;
  readonly reverseAxis: boolean;
};
export type Output = { readonly scaledCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinate: { type: "number" },
    origin: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
    reverseAxis: { type: "boolean" },
  },
  required: ["coordinate", "origin", "suppliedScale", "reverseAxis"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scaledCoordinate: { type: "number" } },
  required: ["scaledCoordinate"],
} as const;
/** Apply supplied scale/origin/sign metadata to one landmark coordinate without anatomical identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinate, origin, suppliedScale, reverseAxis } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      scaledCoordinate:
        (coordinate - origin) * suppliedScale * (reverseAxis ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinate: 12, origin: 2, suppliedScale: 0.5, reverseAxis: false },
  output: { scaledCoordinate: 5 },
} satisfies ToolExample<Input, Output>;
export const landmarkCoordinateScaleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/landmark-coordinate-scale-factor",
    title: "Landmark Coordinate Scale Factor Tool",
    description:
      "Apply supplied scale/origin/sign metadata to one landmark coordinate without anatomical identification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinate: { type: "number" },
        origin: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
        reverseAxis: { type: "boolean" },
      },
      required: ["coordinate", "origin", "suppliedScale", "reverseAxis"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scaledCoordinate: { type: "number" } },
      required: ["scaledCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseAxis",
          label: "Reverse Axis",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "scaledCoordinate",
          label: "Scaled Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = landmarkCoordinateScaleFactorTool.execute;
export default landmarkCoordinateScaleFactorTool;
