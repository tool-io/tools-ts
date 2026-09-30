import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regularHours: number;
  readonly overtimeHours: number;
  readonly baseRate: number;
  readonly multiplier: number;
};
export type Output = {
  readonly regularCost: number;
  readonly overtimeCost: number;
  readonly premium: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regularHours: { type: "number", minimum: 0 },
    overtimeHours: { type: "number", minimum: 0 },
    baseRate: { type: "number", minimum: 0 },
    multiplier: { type: "number", minimum: 1 },
  },
  required: ["regularHours", "overtimeHours", "baseRate", "multiplier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regularCost: { type: "number" },
    overtimeCost: { type: "number" },
    premium: { type: "number" },
    total: { type: "number" },
  },
  required: ["regularCost", "overtimeCost", "premium", "total"],
} as const;
/** Calculate resource overtime premium one shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regularHours, overtimeHours, baseRate, multiplier } = request;
  const compute = (): Output => {
    H.domain(
      regularHours >= 0 &&
        overtimeHours >= 0 &&
        baseRate >= 0 &&
        multiplier >= 1,
    );
    return {
      regularCost: regularHours * baseRate,
      overtimeCost: overtimeHours * baseRate * multiplier,
      premium: overtimeHours * baseRate * (multiplier - 1),
      total: (regularHours + overtimeHours * multiplier) * baseRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { regularHours: 8, overtimeHours: 2, baseRate: 20, multiplier: 1.5 },
  output: { regularCost: 160, overtimeCost: 60, premium: 20, total: 220 },
} satisfies ToolExample<Input, Output>;
export const resourceOvertimePremiumOneShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/resource-overtime-premium-one-shift",
    title: "Resource Overtime Premium One Shift Tool",
    description:
      "Calculate resource overtime premium one shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regularHours: { type: "number", minimum: 0 },
        overtimeHours: { type: "number", minimum: 0 },
        baseRate: { type: "number", minimum: 0 },
        multiplier: { type: "number", minimum: 1 },
      },
      required: ["regularHours", "overtimeHours", "baseRate", "multiplier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regularCost: { type: "number" },
        overtimeCost: { type: "number" },
        premium: { type: "number" },
        total: { type: "number" },
      },
      required: ["regularCost", "overtimeCost", "premium", "total"],
    },
    ports: {
      inputs: [
        {
          id: "regularHours",
          label: "Regular Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overtimeHours",
          label: "Overtime Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseRate",
          label: "Base Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "regularCost",
          label: "Regular Cost",
          valueType: { type: "number" },
        },
        {
          id: "overtimeCost",
          label: "Overtime Cost",
          valueType: { type: "number" },
        },
        { id: "premium", label: "Premium", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = resourceOvertimePremiumOneShiftTool.execute;
export default resourceOvertimePremiumOneShiftTool;
