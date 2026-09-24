import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialFloat: number;
  readonly delay: number;
  readonly suppliedRecovery: number;
};
export type Output = {
  readonly consumedFloat: number;
  readonly remainingFloat: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialFloat: { type: "number", minimum: 0 },
    delay: { type: "number", minimum: 0 },
    suppliedRecovery: { type: "number", minimum: 0 },
  },
  required: ["initialFloat", "delay", "suppliedRecovery"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedFloat: { type: "number" },
    remainingFloat: { type: "number" },
  },
  required: ["consumedFloat", "remainingFloat"],
} as const;
/** Supplied schedule float ledger without critical-path or contractual delay attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialFloat, delay, suppliedRecovery } = request;
  const compute = (): Output => {
    H.domain(
      initialFloat >= 0 &&
        delay >= 0 &&
        suppliedRecovery >= 0 &&
        suppliedRecovery <= delay,
    );
    return {
      consumedFloat: delay - suppliedRecovery,
      remainingFloat: initialFloat - delay + suppliedRecovery,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialFloat: 10, delay: 7, suppliedRecovery: 2 },
  output: { consumedFloat: 5, remainingFloat: 5 },
} satisfies ToolExample<Input, Output>;
export const floatConsumptionPerDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/float-consumption-per-delay",
    title: "Float Consumption Per Delay Tool",
    description:
      "Supplied schedule float ledger without critical-path or contractual delay attribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialFloat: { type: "number", minimum: 0 },
        delay: { type: "number", minimum: 0 },
        suppliedRecovery: { type: "number", minimum: 0 },
      },
      required: ["initialFloat", "delay", "suppliedRecovery"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumedFloat: { type: "number" },
        remainingFloat: { type: "number" },
      },
      required: ["consumedFloat", "remainingFloat"],
    },
    ports: {
      inputs: [
        {
          id: "initialFloat",
          label: "Initial Float",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delay",
          label: "Delay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRecovery",
          label: "Supplied Recovery",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "consumedFloat",
          label: "Consumed Float",
          valueType: { type: "number" },
        },
        {
          id: "remainingFloat",
          label: "Remaining Float",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = floatConsumptionPerDelayTool.execute;
export default floatConsumptionPerDelayTool;
