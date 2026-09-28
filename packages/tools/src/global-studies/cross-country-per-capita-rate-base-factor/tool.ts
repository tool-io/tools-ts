import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEvents: number;
  readonly firstPopulation: number;
  readonly secondEvents: number;
  readonly secondPopulation: number;
  readonly rateBase: number;
};
export type Output = {
  readonly firstRate: number;
  readonly secondRate: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEvents: { type: "number", minimum: 0 },
    firstPopulation: { type: "number", exclusiveMinimum: 0 },
    secondEvents: { type: "number", minimum: 0 },
    secondPopulation: { type: "number", exclusiveMinimum: 0 },
    rateBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstEvents",
    "firstPopulation",
    "secondEvents",
    "secondPopulation",
    "rateBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRate: { type: "number" },
    secondRate: { type: "number" },
    gap: { type: "number" },
  },
  required: ["firstRate", "secondRate", "gap"],
} as const;
/** Compare matched event rates on one explicit population base; definitions and periods must be aligned externally. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstEvents,
    firstPopulation,
    secondEvents,
    secondPopulation,
    rateBase,
  } = request;
  const compute = (): Output => {
    H.domain(firstEvents >= 0 && secondEvents >= 0);
    H.positive(firstPopulation);
    H.positive(secondPopulation);
    H.positive(rateBase);
    return {
      firstRate: (firstEvents * rateBase) / firstPopulation,
      secondRate: (secondEvents * rateBase) / secondPopulation,
      gap:
        (firstEvents * rateBase) / firstPopulation -
        (secondEvents * rateBase) / secondPopulation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEvents: 20,
    firstPopulation: 1000,
    secondEvents: 45,
    secondPopulation: 3000,
    rateBase: 1000,
  },
  output: { firstRate: 20, secondRate: 15, gap: 5 },
} satisfies ToolExample<Input, Output>;
export const crossCountryPerCapitaRateBaseFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/cross-country-per-capita-rate-base-factor",
      title: "Cross Country Per Capita Rate Base Factor Tool",
      description:
        "Compare matched event rates on one explicit population base; definitions and periods must be aligned externally.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstEvents: { type: "number", minimum: 0 },
          firstPopulation: { type: "number", exclusiveMinimum: 0 },
          secondEvents: { type: "number", minimum: 0 },
          secondPopulation: { type: "number", exclusiveMinimum: 0 },
          rateBase: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "firstEvents",
          "firstPopulation",
          "secondEvents",
          "secondPopulation",
          "rateBase",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstRate: { type: "number" },
          secondRate: { type: "number" },
          gap: { type: "number" },
        },
        required: ["firstRate", "secondRate", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "firstEvents",
            label: "First Events",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstPopulation",
            label: "First Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondEvents",
            label: "Second Events",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondPopulation",
            label: "Second Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rateBase",
            label: "Rate Base",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstRate",
            label: "First Rate",
            valueType: { type: "number" },
          },
          {
            id: "secondRate",
            label: "Second Rate",
            valueType: { type: "number" },
          },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = crossCountryPerCapitaRateBaseFactorTool.execute;
export default crossCountryPerCapitaRateBaseFactorTool;
