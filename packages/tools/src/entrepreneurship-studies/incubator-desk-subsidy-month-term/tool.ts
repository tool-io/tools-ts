import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly desks: number;
  readonly months: number;
  readonly marketMonthlyRate: number;
  readonly subsidizedMonthlyRate: number;
  readonly occupancyFraction: number;
};
export type Output = {
  readonly deskMonths: number;
  readonly subsidyValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    desks: { type: "integer", minimum: 0 },
    months: { type: "number", minimum: 0 },
    marketMonthlyRate: { type: "number", minimum: 0 },
    subsidizedMonthlyRate: { type: "number", minimum: 0 },
    occupancyFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "desks",
    "months",
    "marketMonthlyRate",
    "subsidizedMonthlyRate",
    "occupancyFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deskMonths: { type: "number" },
    subsidyValue: { type: "number" },
  },
  required: ["deskMonths", "subsidyValue"],
} as const;
/** Calculate incubator desk subsidy month term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    desks,
    months,
    marketMonthlyRate,
    subsidizedMonthlyRate,
    occupancyFraction,
  } = request;
  const compute = (): Output => {
    H.integer(desks, 0);
    H.domain(
      months >= 0 && marketMonthlyRate >= 0 && subsidizedMonthlyRate >= 0,
    );
    H.probability(occupancyFraction);
    return {
      deskMonths: desks * months * occupancyFraction,
      subsidyValue:
        desks *
        months *
        occupancyFraction *
        (marketMonthlyRate - subsidizedMonthlyRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    desks: 4,
    months: 6,
    marketMonthlyRate: 300,
    subsidizedMonthlyRate: 100,
    occupancyFraction: 0.75,
  },
  output: { deskMonths: 18, subsidyValue: 3600 },
} satisfies ToolExample<Input, Output>;
export const incubatorDeskSubsidyMonthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/incubator-desk-subsidy-month-term",
    title: "Incubator Desk Subsidy Month Term Tool",
    description:
      "Calculate incubator desk subsidy month term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        desks: { type: "integer", minimum: 0 },
        months: { type: "number", minimum: 0 },
        marketMonthlyRate: { type: "number", minimum: 0 },
        subsidizedMonthlyRate: { type: "number", minimum: 0 },
        occupancyFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "desks",
        "months",
        "marketMonthlyRate",
        "subsidizedMonthlyRate",
        "occupancyFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deskMonths: { type: "number" },
        subsidyValue: { type: "number" },
      },
      required: ["deskMonths", "subsidyValue"],
    },
    ports: {
      inputs: [
        {
          id: "desks",
          label: "Desks",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "months",
          label: "Months",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "marketMonthlyRate",
          label: "Market Monthly Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "subsidizedMonthlyRate",
          label: "Subsidized Monthly Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupancyFraction",
          label: "Occupancy Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "deskMonths",
          label: "Desk Months",
          valueType: { type: "number" },
        },
        {
          id: "subsidyValue",
          label: "Subsidy Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = incubatorDeskSubsidyMonthTermTool.execute;
export default incubatorDeskSubsidyMonthTermTool;
