import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly signedDistance: number };
export type Output = { readonly flipped: number; readonly magnitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedDistance: { type: "number" } },
  required: ["signedDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flipped: { type: "number" }, magnitude: { type: "number" } },
  required: ["flipped", "magnitude"],
} as const;
/** Calculate signed line distance orientation flip from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signedDistance } = request;
  const compute = (): Output => {
    return { flipped: -signedDistance, magnitude: Math.abs(signedDistance) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signedDistance: -3 },
  output: { flipped: 3, magnitude: 3 },
} satisfies ToolExample<Input, Output>;
export const signedLineDistanceOrientationFlipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/signed-line-distance-orientation-flip",
    title: "Signed Line Distance Orientation Flip Tool",
    description:
      "Calculate signed line distance orientation flip from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedDistance: { type: "number" } },
      required: ["signedDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flipped: { type: "number" },
        magnitude: { type: "number" },
      },
      required: ["flipped", "magnitude"],
    },
    ports: {
      inputs: [
        {
          id: "signedDistance",
          label: "Signed Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "flipped", label: "Flipped", valueType: { type: "number" } },
        { id: "magnitude", label: "Magnitude", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = signedLineDistanceOrientationFlipTool.execute;
export default signedLineDistanceOrientationFlipTool;
