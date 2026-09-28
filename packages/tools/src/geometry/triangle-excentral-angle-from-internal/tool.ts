import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly angleDegrees: number };
export type Output = { readonly excentralAngleDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angleDegrees: { type: "number" } },
  required: ["angleDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { excentralAngleDegrees: { type: "number" } },
  required: ["excentralAngleDegrees"],
} as const;
/** Compute triangle excentral angle from internal from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { angleDegrees } = input;
  const compute = (): Output => {
    domain(angleDegrees > 0 && angleDegrees < 180);
    return { excentralAngleDegrees: 90 - angleDegrees / 2 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { angleDegrees: 60 },
  output: { excentralAngleDegrees: 60 },
} satisfies ToolExample<Input, Output>;
export const triangleExcentralAngleFromInternalTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "geometry/triangle-excentral-angle-from-internal",
  title: "Triangle Excentral Angle From Internal Tool",
  description:
    "Compute triangle excentral angle from internal from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "angleDegrees",
        label: "Angle Degrees",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "excentralAngleDegrees",
        label: "Excentral Angle Degrees",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = triangleExcentralAngleFromInternalTool.execute;
export default triangleExcentralAngleFromInternalTool;
