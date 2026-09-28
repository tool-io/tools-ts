import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly income: number;
  readonly adults: number;
  readonly children: number;
  readonly firstAdultWeight: number;
  readonly otherAdultWeight: number;
  readonly childWeight: number;
};
export type Output = {
  readonly equivalenceScale: number;
  readonly equivalentIncome: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    income: { type: "number" },
    adults: { type: "integer", minimum: 1 },
    children: { type: "integer", minimum: 0 },
    firstAdultWeight: { type: "number", exclusiveMinimum: 0 },
    otherAdultWeight: { type: "number", minimum: 0 },
    childWeight: { type: "number", minimum: 0 },
  },
  required: [
    "income",
    "adults",
    "children",
    "firstAdultWeight",
    "otherAdultWeight",
    "childWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalenceScale: { type: "number" },
    equivalentIncome: { type: "number" },
  },
  required: ["equivalenceScale", "equivalentIncome"],
} as const;
/** Explicit caller-defined additive household equivalence scale, without choosing an OECD or local poverty scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    income,
    adults,
    children,
    firstAdultWeight,
    otherAdultWeight,
    childWeight,
  } = request;
  const compute = (): Output => {
    H.integer(adults, 1);
    H.integer(children, 0);
    H.domain(firstAdultWeight > 0 && otherAdultWeight >= 0 && childWeight >= 0);
    return {
      equivalenceScale:
        firstAdultWeight +
        (adults - 1) * otherAdultWeight +
        children * childWeight,
      equivalentIncome:
        income /
        (firstAdultWeight +
          (adults - 1) * otherAdultWeight +
          children * childWeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    income: 30000,
    adults: 2,
    children: 1,
    firstAdultWeight: 1,
    otherAdultWeight: 0.5,
    childWeight: 0.3,
  },
  output: { equivalenceScale: 1.8, equivalentIncome: 16666.666666666668 },
} satisfies ToolExample<Input, Output>;
export const laterlifeHouseholdEquivalenceCallerWeightTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/laterlife-household-equivalence-caller-weight",
      title: "Laterlife Household Equivalence Caller Weight Tool",
      description:
        "Explicit caller-defined additive household equivalence scale, without choosing an OECD or local poverty scale.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          income: { type: "number" },
          adults: { type: "integer", minimum: 1 },
          children: { type: "integer", minimum: 0 },
          firstAdultWeight: { type: "number", exclusiveMinimum: 0 },
          otherAdultWeight: { type: "number", minimum: 0 },
          childWeight: { type: "number", minimum: 0 },
        },
        required: [
          "income",
          "adults",
          "children",
          "firstAdultWeight",
          "otherAdultWeight",
          "childWeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          equivalenceScale: { type: "number" },
          equivalentIncome: { type: "number" },
        },
        required: ["equivalenceScale", "equivalentIncome"],
      },
      ports: {
        inputs: [
          {
            id: "income",
            label: "Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "adults",
            label: "Adults",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "children",
            label: "Children",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstAdultWeight",
            label: "First Adult Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherAdultWeight",
            label: "Other Adult Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "childWeight",
            label: "Child Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "equivalenceScale",
            label: "Equivalence Scale",
            valueType: { type: "number" },
          },
          {
            id: "equivalentIncome",
            label: "Equivalent Income",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = laterlifeHouseholdEquivalenceCallerWeightTool.execute;
export default laterlifeHouseholdEquivalenceCallerWeightTool;
