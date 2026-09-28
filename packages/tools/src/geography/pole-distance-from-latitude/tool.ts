import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly latitudeDegrees: number;
  readonly northPole: boolean;
};
export type Output = { readonly angularDistanceDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    latitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
    northPole: { type: "boolean" },
  },
  required: ["latitudeDegrees", "northPole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angularDistanceDegrees: { type: "number" } },
  required: ["angularDistanceDegrees"],
} as const;
/** Calculate pole distance from latitude from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latitudeDegrees, northPole } = request;
  const compute = (): Output => {
    H.domain(latitudeDegrees >= -90 && latitudeDegrees <= 90);
    return {
      angularDistanceDegrees: northPole
        ? 90 - latitudeDegrees
        : 90 + latitudeDegrees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latitudeDegrees: 40, northPole: true },
  output: { angularDistanceDegrees: 50 },
} satisfies ToolExample<Input, Output>;
export const poleDistanceFromLatitudeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geography/pole-distance-from-latitude",
    title: "Pole Distance From Latitude Tool",
    description:
      "Calculate pole distance from latitude from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        latitudeDegrees: { type: "number", minimum: -90, maximum: 90 },
        northPole: { type: "boolean" },
      },
      required: ["latitudeDegrees", "northPole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angularDistanceDegrees: { type: "number" } },
      required: ["angularDistanceDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "latitudeDegrees",
          label: "Latitude Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "northPole",
          label: "North Pole",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "angularDistanceDegrees",
          label: "Angular Distance Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = poleDistanceFromLatitudeTool.execute;
export default poleDistanceFromLatitudeTool;
