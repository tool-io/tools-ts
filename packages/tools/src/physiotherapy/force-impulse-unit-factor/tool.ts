import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly impulse: number;
  readonly forceUnitFactor: number;
  readonly timeUnitFactor: number;
};
export type Output = { readonly convertedImpulse: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    impulse: { type: "number" },
    forceUnitFactor: { type: "number", exclusiveMinimum: 0 },
    timeUnitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["impulse", "forceUnitFactor", "timeUnitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedImpulse: { type: "number" } },
  required: ["convertedImpulse"],
} as const;
/** Calculate force impulse unit factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { impulse, forceUnitFactor, timeUnitFactor } = request;
  const compute = (): Output => {
    H.positive(forceUnitFactor);
    H.positive(timeUnitFactor);
    return { convertedImpulse: impulse * forceUnitFactor * timeUnitFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { impulse: 2, forceUnitFactor: 1000, timeUnitFactor: 0.001 },
  output: { convertedImpulse: 2 },
} satisfies ToolExample<Input, Output>;
export const forceImpulseUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiotherapy/force-impulse-unit-factor",
    title: "Force Impulse Unit Factor Tool",
    description:
      "Calculate force impulse unit factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        impulse: { type: "number" },
        forceUnitFactor: { type: "number", exclusiveMinimum: 0 },
        timeUnitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["impulse", "forceUnitFactor", "timeUnitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedImpulse: { type: "number" } },
      required: ["convertedImpulse"],
    },
    ports: {
      inputs: [
        {
          id: "impulse",
          label: "Impulse",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forceUnitFactor",
          label: "Force Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeUnitFactor",
          label: "Time Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedImpulse",
          label: "Converted Impulse",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = forceImpulseUnitFactorTool.execute;
export default forceImpulseUnitFactorTool;
