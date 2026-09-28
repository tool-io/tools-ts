import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly periodStart: number;
  readonly periodEnd: number;
  readonly coverageStart: number;
  readonly coverageEnd: number;
  readonly fullBenefit: number;
};
export type Output = {
  readonly coveredDays: number;
  readonly fraction: number;
  readonly proratedBenefit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodStart: { type: "integer" },
    periodEnd: { type: "integer" },
    coverageStart: { type: "integer" },
    coverageEnd: { type: "integer" },
    fullBenefit: { type: "number" },
  },
  required: [
    "periodStart",
    "periodEnd",
    "coverageStart",
    "coverageEnd",
    "fullBenefit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredDays: { type: "integer" },
    fraction: { type: "number" },
    proratedBenefit: { type: "number" },
  },
  required: ["coveredDays", "fraction", "proratedBenefit"],
} as const;
/** Calculate health benefit coverage calendar proration from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { periodStart, periodEnd, coverageStart, coverageEnd, fullBenefit } =
    request;
  const compute = (): Output => {
    H.domain(periodEnd > periodStart && coverageEnd >= coverageStart);
    return {
      coveredDays: Math.max(
        0,
        Math.min(periodEnd, coverageEnd) - Math.max(periodStart, coverageStart),
      ),
      fraction:
        Math.max(
          0,
          Math.min(periodEnd, coverageEnd) -
            Math.max(periodStart, coverageStart),
        ) /
        (periodEnd - periodStart),
      proratedBenefit:
        (fullBenefit *
          Math.max(
            0,
            Math.min(periodEnd, coverageEnd) -
              Math.max(periodStart, coverageStart),
          )) /
        (periodEnd - periodStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    periodStart: 0,
    periodEnd: 30,
    coverageStart: 10,
    coverageEnd: 40,
    fullBenefit: 300,
  },
  output: {
    coveredDays: 20,
    fraction: 0.6666666666666666,
    proratedBenefit: 200,
  },
} satisfies ToolExample<Input, Output>;
export const healthBenefitCoverageCalendarProrationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-policy/health-benefit-coverage-calendar-proration",
      title: "Health Benefit Coverage Calendar Proration Tool",
      description:
        "Calculate health benefit coverage calendar proration from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          periodStart: { type: "integer" },
          periodEnd: { type: "integer" },
          coverageStart: { type: "integer" },
          coverageEnd: { type: "integer" },
          fullBenefit: { type: "number" },
        },
        required: [
          "periodStart",
          "periodEnd",
          "coverageStart",
          "coverageEnd",
          "fullBenefit",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coveredDays: { type: "integer" },
          fraction: { type: "number" },
          proratedBenefit: { type: "number" },
        },
        required: ["coveredDays", "fraction", "proratedBenefit"],
      },
      ports: {
        inputs: [
          {
            id: "periodStart",
            label: "Period Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "periodEnd",
            label: "Period End",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "coverageStart",
            label: "Coverage Start",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "coverageEnd",
            label: "Coverage End",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "fullBenefit",
            label: "Full Benefit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "coveredDays",
            label: "Covered Days",
            valueType: { type: "integer" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "proratedBenefit",
            label: "Prorated Benefit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthBenefitCoverageCalendarProrationTool.execute;
export default healthBenefitCoverageCalendarProrationTool;
