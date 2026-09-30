import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly delayDays: number; readonly totalFloat: number };
export type Output = {
  readonly consumedFloat: number;
  readonly remainingFloat: number;
  readonly unabsorbedDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delayDays: { type: "number", minimum: 0 },
    totalFloat: { type: "number", minimum: 0 },
  },
  required: ["delayDays", "totalFloat"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedFloat: { type: "number" },
    remainingFloat: { type: "number" },
    unabsorbedDelay: { type: "number" },
  },
  required: ["consumedFloat", "remainingFloat", "unabsorbedDelay"],
} as const;
/** Calculate milestone delay float consumption from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delayDays, totalFloat } = request;
  const compute = (): Output => {
    H.domain(delayDays >= 0 && totalFloat >= 0);
    return {
      consumedFloat: Math.min(delayDays, totalFloat),
      remainingFloat: Math.max(0, totalFloat - delayDays),
      unabsorbedDelay: Math.max(0, delayDays - totalFloat),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { delayDays: 3, totalFloat: 5 },
  output: { consumedFloat: 3, remainingFloat: 2, unabsorbedDelay: 0 },
} satisfies ToolExample<Input, Output>;
export const milestoneDelayFloatConsumptionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/milestone-delay-float-consumption",
    title: "Milestone Delay Float Consumption Tool",
    description:
      "Calculate milestone delay float consumption from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delayDays: { type: "number", minimum: 0 },
        totalFloat: { type: "number", minimum: 0 },
      },
      required: ["delayDays", "totalFloat"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumedFloat: { type: "number" },
        remainingFloat: { type: "number" },
        unabsorbedDelay: { type: "number" },
      },
      required: ["consumedFloat", "remainingFloat", "unabsorbedDelay"],
    },
    ports: {
      inputs: [
        {
          id: "delayDays",
          label: "Delay Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalFloat",
          label: "Total Float",
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
        {
          id: "unabsorbedDelay",
          label: "Unabsorbed Delay",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = milestoneDelayFloatConsumptionTool.execute;
export default milestoneDelayFloatConsumptionTool;
