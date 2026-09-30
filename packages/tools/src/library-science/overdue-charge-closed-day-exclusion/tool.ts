import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsedDays: number;
  readonly graceDays: number;
  readonly closedDays: number;
  readonly dailyCharge: number;
  readonly suppliedCap: number;
};
export type Output = {
  readonly chargeableDays: number;
  readonly uncapped: number;
  readonly charge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedDays: { type: "integer", minimum: 0 },
    graceDays: { type: "integer", minimum: 0 },
    closedDays: { type: "integer", minimum: 0 },
    dailyCharge: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: [
    "elapsedDays",
    "graceDays",
    "closedDays",
    "dailyCharge",
    "suppliedCap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargeableDays: { type: "integer" },
    uncapped: { type: "number" },
    charge: { type: "number" },
  },
  required: ["chargeableDays", "uncapped", "charge"],
} as const;
/** Grace and closed days are supplied as disjoint excluded counts, with an explicit fee cap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsedDays, graceDays, closedDays, dailyCharge, suppliedCap } =
    request;
  const compute = (): Output => {
    H.integer(elapsedDays, 0);
    H.integer(graceDays, 0, elapsedDays);
    H.integer(closedDays, 0, elapsedDays - graceDays);
    H.domain(dailyCharge >= 0 && suppliedCap >= 0);
    return {
      chargeableDays: Math.max(0, elapsedDays - graceDays - closedDays),
      uncapped: Math.max(0, elapsedDays - graceDays - closedDays) * dailyCharge,
      charge: Math.min(
        suppliedCap,
        Math.max(0, elapsedDays - graceDays - closedDays) * dailyCharge,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elapsedDays: 12,
    graceDays: 2,
    closedDays: 3,
    dailyCharge: 0.5,
    suppliedCap: 10,
  },
  output: { chargeableDays: 7, uncapped: 3.5, charge: 3.5 },
} satisfies ToolExample<Input, Output>;
export const overdueChargeClosedDayExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/overdue-charge-closed-day-exclusion",
    title: "Overdue Charge Closed Day Exclusion Tool",
    description:
      "Grace and closed days are supplied as disjoint excluded counts, with an explicit fee cap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedDays: { type: "integer", minimum: 0 },
        graceDays: { type: "integer", minimum: 0 },
        closedDays: { type: "integer", minimum: 0 },
        dailyCharge: { type: "number", minimum: 0 },
        suppliedCap: { type: "number", minimum: 0 },
      },
      required: [
        "elapsedDays",
        "graceDays",
        "closedDays",
        "dailyCharge",
        "suppliedCap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chargeableDays: { type: "integer" },
        uncapped: { type: "number" },
        charge: { type: "number" },
      },
      required: ["chargeableDays", "uncapped", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "graceDays",
          label: "Grace Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "closedDays",
          label: "Closed Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dailyCharge",
          label: "Daily Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "chargeableDays",
          label: "Chargeable Days",
          valueType: { type: "integer" },
        },
        { id: "uncapped", label: "Uncapped", valueType: { type: "number" } },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = overdueChargeClosedDayExclusionTool.execute;
export default overdueChargeClosedDayExclusionTool;
