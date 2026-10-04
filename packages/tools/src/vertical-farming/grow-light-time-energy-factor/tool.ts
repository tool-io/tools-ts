import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly power: number;
  readonly onDuration: number;
  readonly unitFactor: number;
};
export type Output = { readonly energy: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    power: { type: "number", minimum: 0 },
    onDuration: { type: "number", minimum: 0 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["power", "onDuration", "unitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { energy: { type: "number" } },
  required: ["energy"],
} as const;
/** Convert supplied lighting power-time to energy without selecting crop lighting settings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { power, onDuration, unitFactor } = request;
  const compute = (): Output => {
    H.domain(power >= 0 && onDuration >= 0);
    H.positive(unitFactor);
    return { energy: power * onDuration * unitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { power: 100, onDuration: 10, unitFactor: 0.001 },
  output: { energy: 1 },
} satisfies ToolExample<Input, Output>;
export const growLightTimeEnergyFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/grow-light-time-energy-factor",
    title: "Grow Light Time Energy Factor Tool",
    description:
      "Convert supplied lighting power-time to energy without selecting crop lighting settings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        power: { type: "number", minimum: 0 },
        onDuration: { type: "number", minimum: 0 },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["power", "onDuration", "unitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { energy: { type: "number" } },
      required: ["energy"],
    },
    ports: {
      inputs: [
        {
          id: "power",
          label: "Power",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "onDuration",
          label: "On Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "energy", label: "Energy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = growLightTimeEnergyFactorTool.execute;
export default growLightTimeEnergyFactorTool;
