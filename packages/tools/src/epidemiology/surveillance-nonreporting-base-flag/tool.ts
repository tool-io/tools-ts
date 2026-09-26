import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cases: number;
  readonly reportingPopulation: number;
  readonly nonreportingPopulation: number;
  readonly includeNonreporting: boolean;
};
export type Output = { readonly denominator: number; readonly rate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: { type: "integer", minimum: 0 },
    reportingPopulation: { type: "number", exclusiveMinimum: 0 },
    nonreportingPopulation: { type: "number", minimum: 0 },
    includeNonreporting: { type: "boolean" },
  },
  required: [
    "cases",
    "reportingPopulation",
    "nonreportingPopulation",
    "includeNonreporting",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "number" }, rate: { type: "number" } },
  required: ["denominator", "rate"],
} as const;
/** Calculate surveillance nonreporting base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cases,
    reportingPopulation,
    nonreportingPopulation,
    includeNonreporting,
  } = request;
  const compute = (): Output => {
    H.integer(cases, 0);
    H.positive(reportingPopulation);
    H.domain(nonreportingPopulation >= 0);
    return {
      denominator:
        reportingPopulation +
        (includeNonreporting ? nonreportingPopulation : 0),
      rate:
        cases /
        (reportingPopulation +
          (includeNonreporting ? nonreportingPopulation : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cases: 10,
    reportingPopulation: 1000,
    nonreportingPopulation: 500,
    includeNonreporting: false,
  },
  output: { denominator: 1000, rate: 0.01 },
} satisfies ToolExample<Input, Output>;
export const surveillanceNonreportingBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/surveillance-nonreporting-base-flag",
    title: "Surveillance Nonreporting Base Flag Tool",
    description:
      "Calculate surveillance nonreporting base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cases: { type: "integer", minimum: 0 },
        reportingPopulation: { type: "number", exclusiveMinimum: 0 },
        nonreportingPopulation: { type: "number", minimum: 0 },
        includeNonreporting: { type: "boolean" },
      },
      required: [
        "cases",
        "reportingPopulation",
        "nonreportingPopulation",
        "includeNonreporting",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { denominator: { type: "number" }, rate: { type: "number" } },
      required: ["denominator", "rate"],
    },
    ports: {
      inputs: [
        {
          id: "cases",
          label: "Cases",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reportingPopulation",
          label: "Reporting Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nonreportingPopulation",
          label: "Nonreporting Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeNonreporting",
          label: "Include Nonreporting",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
        { id: "rate", label: "Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = surveillanceNonreportingBaseFlagTool.execute;
export default surveillanceNonreportingBaseFlagTool;
