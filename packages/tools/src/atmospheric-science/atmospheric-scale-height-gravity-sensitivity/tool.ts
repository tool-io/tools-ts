import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gasConstant: number;
  readonly temperature: number;
  readonly gravity: number;
};
export type Output = {
  readonly scaleHeight: number;
  readonly derivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    temperature: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["gasConstant", "temperature", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleHeight: { type: "number" },
    derivative: { type: "number" },
  },
  required: ["scaleHeight", "derivative"],
} as const;
/** Calculate atmospheric scale height gravity sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gasConstant, temperature, gravity } = request;
  const compute = (): Output => {
    H.positive(gasConstant);
    H.positive(temperature);
    H.positive(gravity);
    return {
      scaleHeight: (gasConstant * temperature) / gravity,
      derivative: (-gasConstant * temperature) / (gravity * gravity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gasConstant: 287, temperature: 280, gravity: 10 },
  output: { scaleHeight: 8036, derivative: -803.6 },
} satisfies ToolExample<Input, Output>;
export const atmosphericScaleHeightGravitySensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-science/atmospheric-scale-height-gravity-sensitivity",
      title: "Atmospheric Scale Height Gravity Sensitivity Tool",
      description:
        "Calculate atmospheric scale height gravity sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gasConstant: { type: "number", exclusiveMinimum: 0 },
          temperature: { type: "number", exclusiveMinimum: 0 },
          gravity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["gasConstant", "temperature", "gravity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scaleHeight: { type: "number" },
          derivative: { type: "number" },
        },
        required: ["scaleHeight", "derivative"],
      },
      ports: {
        inputs: [
          {
            id: "gasConstant",
            label: "Gas Constant",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperature",
            label: "Temperature",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "gravity",
            label: "Gravity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "scaleHeight",
            label: "Scale Height",
            valueType: { type: "number" },
          },
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
export const run = atmosphericScaleHeightGravitySensitivityTool.execute;
export default atmosphericScaleHeightGravitySensitivityTool;
