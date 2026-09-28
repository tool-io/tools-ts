import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly latitudeRadians: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { latitudeRadians: { type: "number" } },
  required: ["latitudeRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate latitude parallel circumference radius sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { latitudeRadians } = request;
  const compute = (): Output => {
    H.domain(Math.abs(latitudeRadians) <= Math.PI / 2);
    return { derivative: 2 * Math.PI * Math.cos(latitudeRadians) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { latitudeRadians: 0 },
  output: { derivative: 6.283185307179586 },
} satisfies ToolExample<Input, Output>;
export const latitudeParallelCircumferenceRadiusSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geography/latitude-parallel-circumference-radius-sensitivity",
      title: "Latitude Parallel Circumference Radius Sensitivity Tool",
      description:
        "Calculate latitude parallel circumference radius sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { latitudeRadians: { type: "number" } },
        required: ["latitudeRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
      ports: {
        inputs: [
          {
            id: "latitudeRadians",
            label: "Latitude Radians",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = latitudeParallelCircumferenceRadiusSensitivityTool.execute;
export default latitudeParallelCircumferenceRadiusSensitivityTool;
