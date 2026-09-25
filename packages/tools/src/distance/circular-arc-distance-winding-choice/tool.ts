import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly fromRadians: number;
  readonly toRadians: number;
  readonly radius: number;
  readonly winding: number;
};
export type Output = { readonly signedAngle: number; readonly length: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fromRadians: { type: "number" },
    toRadians: { type: "number" },
    radius: { type: "number" },
    winding: { type: "integer", minimum: -1000000, maximum: 1000000 },
  },
  required: ["fromRadians", "toRadians", "radius", "winding"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedAngle: { type: "number" }, length: { type: "number" } },
  required: ["signedAngle", "length"],
} as const;
/** Compute circular arc distance winding choice from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { fromRadians, toRadians, radius, winding } = input;
  const compute = (): Output => {
    domain(radius >= 0);
    integer(winding, -1000000, 1000000);
    const signedAngle = toRadians - fromRadians + 2 * Math.PI * winding;
    return { signedAngle, length: radius * Math.abs(signedAngle) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    fromRadians: 0,
    toRadians: 3.141592653589793,
    radius: 2,
    winding: 0,
  },
  output: { signedAngle: 3.141592653589793, length: 6.283185307179586 },
} satisfies ToolExample<Input, Output>;
export const circularArcDistanceWindingChoiceTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "distance/circular-arc-distance-winding-choice",
  title: "Circular Arc Distance Winding Choice Tool",
  description:
    "Compute circular arc distance winding choice from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "fromRadians",
        label: "From Radians",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "toRadians",
        label: "To Radians",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "radius",
        label: "Radius",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "winding",
        label: "Winding",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "signedAngle",
        label: "Signed Angle",
        valueType: { type: "number" },
      },
      { id: "length", label: "Length", valueType: { type: "number" } },
    ],
  },
});
export const run = circularArcDistanceWindingChoiceTool.execute;
export default circularArcDistanceWindingChoiceTool;
