import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pitch: number;
  readonly revolutionsPerSecond: number;
  readonly advanceSpeed: number;
};
export type Output = {
  readonly idealAdvanceSpeed: number;
  readonly slipFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pitch: { type: "number", exclusiveMinimum: 0 },
    revolutionsPerSecond: { type: "number", exclusiveMinimum: 0 },
    advanceSpeed: { type: "number" },
  },
  required: ["pitch", "revolutionsPerSecond", "advanceSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idealAdvanceSpeed: { type: "number" },
    slipFraction: { type: "number" },
  },
  required: ["idealAdvanceSpeed", "slipFraction"],
} as const;
/** Calculate propeller slip measured advance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pitch, revolutionsPerSecond, advanceSpeed } = request;
  const compute = (): Output => {
    H.positive(pitch);
    H.positive(revolutionsPerSecond);
    const idealAdvanceSpeed = pitch * revolutionsPerSecond;
    return {
      idealAdvanceSpeed,
      slipFraction: 1 - advanceSpeed / idealAdvanceSpeed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pitch: 2, revolutionsPerSecond: 5, advanceSpeed: 8 },
  output: { idealAdvanceSpeed: 10, slipFraction: 0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const propellerSlipMeasuredAdvanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/propeller-slip-measured-advance-term",
    title: "Propeller Slip Measured Advance Term Tool",
    description:
      "Calculate propeller slip measured advance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pitch: { type: "number", exclusiveMinimum: 0 },
        revolutionsPerSecond: { type: "number", exclusiveMinimum: 0 },
        advanceSpeed: { type: "number" },
      },
      required: ["pitch", "revolutionsPerSecond", "advanceSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        idealAdvanceSpeed: { type: "number" },
        slipFraction: { type: "number" },
      },
      required: ["idealAdvanceSpeed", "slipFraction"],
    },
    ports: {
      inputs: [
        {
          id: "pitch",
          label: "Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "revolutionsPerSecond",
          label: "Revolutions Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "advanceSpeed",
          label: "Advance Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "idealAdvanceSpeed",
          label: "Ideal Advance Speed",
          valueType: { type: "number" },
        },
        {
          id: "slipFraction",
          label: "Slip Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = propellerSlipMeasuredAdvanceTermTool.execute;
export default propellerSlipMeasuredAdvanceTermTool;
