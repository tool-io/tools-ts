import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cash: number;
  readonly otherMonthlyBurn: number;
  readonly founderCount: number;
  readonly oldSalary: number;
  readonly newSalary: number;
};
export type Output = {
  readonly oldRunway: number;
  readonly newRunway: number;
  readonly addedMonths: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cash: { type: "number", minimum: 0 },
    otherMonthlyBurn: { type: "number", minimum: 0 },
    founderCount: { type: "integer", minimum: 1 },
    oldSalary: { type: "number", minimum: 0 },
    newSalary: { type: "number", minimum: 0 },
  },
  required: [
    "cash",
    "otherMonthlyBurn",
    "founderCount",
    "oldSalary",
    "newSalary",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldRunway: { type: "number" },
    newRunway: { type: "number" },
    addedMonths: { type: "number" },
  },
  required: ["oldRunway", "newRunway", "addedMonths"],
} as const;
/** Calculate founder salary runway tradeoff term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cash, otherMonthlyBurn, founderCount, oldSalary, newSalary } =
    request;
  const compute = (): Output => {
    H.domain(
      cash >= 0 && otherMonthlyBurn >= 0 && oldSalary >= 0 && newSalary >= 0,
    );
    H.integer(founderCount, 1);
    H.domain(
      otherMonthlyBurn + founderCount * oldSalary > 0 &&
        otherMonthlyBurn + founderCount * newSalary > 0,
    );
    return {
      oldRunway: cash / (otherMonthlyBurn + founderCount * oldSalary),
      newRunway: cash / (otherMonthlyBurn + founderCount * newSalary),
      addedMonths:
        cash / (otherMonthlyBurn + founderCount * newSalary) -
        cash / (otherMonthlyBurn + founderCount * oldSalary),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cash: 120000,
    otherMonthlyBurn: 10000,
    founderCount: 2,
    oldSalary: 5000,
    newSalary: 2500,
  },
  output: { oldRunway: 6, newRunway: 8, addedMonths: 2 },
} satisfies ToolExample<Input, Output>;
export const founderSalaryRunwayTradeoffTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/founder-salary-runway-tradeoff-term",
    title: "Founder Salary Runway Tradeoff Term Tool",
    description:
      "Calculate founder salary runway tradeoff term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cash: { type: "number", minimum: 0 },
        otherMonthlyBurn: { type: "number", minimum: 0 },
        founderCount: { type: "integer", minimum: 1 },
        oldSalary: { type: "number", minimum: 0 },
        newSalary: { type: "number", minimum: 0 },
      },
      required: [
        "cash",
        "otherMonthlyBurn",
        "founderCount",
        "oldSalary",
        "newSalary",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldRunway: { type: "number" },
        newRunway: { type: "number" },
        addedMonths: { type: "number" },
      },
      required: ["oldRunway", "newRunway", "addedMonths"],
    },
    ports: {
      inputs: [
        {
          id: "cash",
          label: "Cash",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherMonthlyBurn",
          label: "Other Monthly Burn",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "founderCount",
          label: "Founder Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oldSalary",
          label: "Old Salary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newSalary",
          label: "New Salary",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "oldRunway", label: "Old Runway", valueType: { type: "number" } },
        { id: "newRunway", label: "New Runway", valueType: { type: "number" } },
        {
          id: "addedMonths",
          label: "Added Months",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = founderSalaryRunwayTradeoffTermTool.execute;
export default founderSalaryRunwayTradeoffTermTool;
