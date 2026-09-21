import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly current: number;
  readonly modulus: number;
  readonly rollover: boolean;
};
export type Output = { readonly delta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer", minimum: 0 },
    current: { type: "integer", minimum: 0 },
    modulus: { type: "integer", minimum: 1 },
    rollover: { type: "boolean" },
  },
  required: ["previous", "current", "modulus", "rollover"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { delta: { type: "integer" } },
  required: ["delta"],
} as const;
/** Compute an explicitly declared single counter rollover exactly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, current, modulus, rollover } = request;
  const compute = (): Output => {
    H.integer(modulus, 1);
    H.integer(previous, 0, modulus - 1);
    H.integer(current, 0, modulus - 1);
    H.domain(rollover || current >= previous);
    return {
      delta: Number(
        BigInt(current) - BigInt(previous) + (rollover ? BigInt(modulus) : 0n),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previous: 990, current: 15, modulus: 1000, rollover: true },
  output: { delta: 25 },
} satisfies ToolExample<Input, Output>;
export const machineLogCounterRolloverDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/machine-log-counter-rollover-delta",
    title: "Machine Log Counter Rollover Delta Tool",
    description:
      "Compute an explicitly declared single counter rollover exactly.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "integer", minimum: 0 },
        current: { type: "integer", minimum: 0 },
        modulus: { type: "integer", minimum: 1 },
        rollover: { type: "boolean" },
      },
      required: ["previous", "current", "modulus", "rollover"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { delta: { type: "integer" } },
      required: ["delta"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "modulus",
          label: "Modulus",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rollover",
          label: "Rollover",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = machineLogCounterRolloverDeltaTool.execute;
export default machineLogCounterRolloverDeltaTool;
