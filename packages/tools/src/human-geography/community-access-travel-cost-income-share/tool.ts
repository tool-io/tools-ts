import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oneWayFare: number;
  readonly weeklyVisits: number;
  readonly paidTravelHoursPerVisit: number;
  readonly hourlyOpportunityCost: number;
  readonly weeklyIncome: number;
};
export type Output = {
  readonly weeklyCashCost: number;
  readonly weeklyGeneralizedCost: number;
  readonly incomeShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneWayFare: { type: "number", minimum: 0 },
    weeklyVisits: { type: "number", minimum: 0 },
    paidTravelHoursPerVisit: { type: "number", minimum: 0 },
    hourlyOpportunityCost: { type: "number", minimum: 0 },
    weeklyIncome: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "oneWayFare",
    "weeklyVisits",
    "paidTravelHoursPerVisit",
    "hourlyOpportunityCost",
    "weeklyIncome",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weeklyCashCost: { type: "number" },
    weeklyGeneralizedCost: { type: "number" },
    incomeShare: { type: "number" },
  },
  required: ["weeklyCashCost", "weeklyGeneralizedCost", "incomeShare"],
} as const;
/** Calculate community access travel cost income share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    oneWayFare,
    weeklyVisits,
    paidTravelHoursPerVisit,
    hourlyOpportunityCost,
    weeklyIncome,
  } = request;
  const compute = (): Output => {
    H.domain(
      oneWayFare >= 0 &&
        weeklyVisits >= 0 &&
        paidTravelHoursPerVisit >= 0 &&
        hourlyOpportunityCost >= 0,
    );
    H.positive(weeklyIncome);
    return {
      weeklyCashCost: 2 * oneWayFare * weeklyVisits,
      weeklyGeneralizedCost:
        weeklyVisits *
        (2 * oneWayFare + paidTravelHoursPerVisit * hourlyOpportunityCost),
      incomeShare:
        (weeklyVisits *
          (2 * oneWayFare + paidTravelHoursPerVisit * hourlyOpportunityCost)) /
        weeklyIncome,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    oneWayFare: 3,
    weeklyVisits: 2,
    paidTravelHoursPerVisit: 1,
    hourlyOpportunityCost: 10,
    weeklyIncome: 400,
  },
  output: { weeklyCashCost: 12, weeklyGeneralizedCost: 32, incomeShare: 0.08 },
} satisfies ToolExample<Input, Output>;
export const communityAccessTravelCostIncomeShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/community-access-travel-cost-income-share",
      title: "Community Access Travel Cost Income Share Tool",
      description:
        "Calculate community access travel cost income share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oneWayFare: { type: "number", minimum: 0 },
          weeklyVisits: { type: "number", minimum: 0 },
          paidTravelHoursPerVisit: { type: "number", minimum: 0 },
          hourlyOpportunityCost: { type: "number", minimum: 0 },
          weeklyIncome: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "oneWayFare",
          "weeklyVisits",
          "paidTravelHoursPerVisit",
          "hourlyOpportunityCost",
          "weeklyIncome",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weeklyCashCost: { type: "number" },
          weeklyGeneralizedCost: { type: "number" },
          incomeShare: { type: "number" },
        },
        required: ["weeklyCashCost", "weeklyGeneralizedCost", "incomeShare"],
      },
      ports: {
        inputs: [
          {
            id: "oneWayFare",
            label: "One Way Fare",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weeklyVisits",
            label: "Weekly Visits",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "paidTravelHoursPerVisit",
            label: "Paid Travel Hours Per Visit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "hourlyOpportunityCost",
            label: "Hourly Opportunity Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weeklyIncome",
            label: "Weekly Income",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weeklyCashCost",
            label: "Weekly Cash Cost",
            valueType: { type: "number" },
          },
          {
            id: "weeklyGeneralizedCost",
            label: "Weekly Generalized Cost",
            valueType: { type: "number" },
          },
          {
            id: "incomeShare",
            label: "Income Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communityAccessTravelCostIncomeShareTool.execute;
export default communityAccessTravelCostIncomeShareTool;
