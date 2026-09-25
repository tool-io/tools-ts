import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly value: number; readonly plane: number };
export type Output = { readonly before: number; readonly after: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, plane: { type: "number" } },
  required: ["value", "plane"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { before: { type: "number" }, after: { type: "number" } },
  required: ["before", "after"],
} as const;
/** Compute signed distance axis reflection effect from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { value, plane } = input;
  const compute = (): Output => {
    return { before: value - plane, after: plane - value };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 5, plane: 2 },
  output: { before: 3, after: -3 },
} satisfies ToolExample<Input, Output>;
export const signedDistanceAxisReflectionEffectTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "distance/signed-distance-axis-reflection-effect",
  title: "Signed Distance Axis Reflection Effect Tool",
  description:
    "Compute signed distance axis reflection effect from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "plane",
        label: "Plane",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "before", label: "Before", valueType: { type: "number" } },
      { id: "after", label: "After", valueType: { type: "number" } },
    ],
  },
});
export const run = signedDistanceAxisReflectionEffectTool.execute;
export default signedDistanceAxisReflectionEffectTool;
