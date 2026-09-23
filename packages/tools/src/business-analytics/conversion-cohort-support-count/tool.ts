import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inCohort: readonly boolean[];
  readonly observed: readonly boolean[];
  readonly converted: readonly boolean[];
};
export type Output = {
  readonly supported: number;
  readonly conversions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inCohort: { type: "array", maxItems: 256, items: { type: "boolean" } },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    converted: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["inCohort", "observed", "converted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supported: { type: "integer" },
    conversions: { type: "integer" },
  },
  required: ["supported", "conversions"],
} as const;
/** Calculate conversion cohort support count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inCohort, observed, converted } = request;
  const compute = (): Output => {
    H.sameLength(inCohort, observed);
    H.sameLength(inCohort, converted);
    return {
      supported: inCohort.filter((x, i) => x && observed[i]).length,
      conversions: inCohort.filter((x, i) => x && observed[i] && converted[i])
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inCohort: [true, true, false],
    observed: [true, false, true],
    converted: [true, true, true],
  },
  output: { supported: 1, conversions: 1 },
} satisfies ToolExample<Input, Output>;
export const conversionCohortSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/conversion-cohort-support-count",
    title: "Conversion Cohort Support Count Tool",
    description:
      "Calculate conversion cohort support count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inCohort: { type: "array", maxItems: 256, items: { type: "boolean" } },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        converted: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["inCohort", "observed", "converted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supported: { type: "integer" },
        conversions: { type: "integer" },
      },
      required: ["supported", "conversions"],
    },
    ports: {
      inputs: [
        {
          id: "inCohort",
          label: "In Cohort",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "converted",
          label: "Converted",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "supported", label: "Supported", valueType: { type: "integer" } },
        {
          id: "conversions",
          label: "Conversions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = conversionCohortSupportCountTool.execute;
export default conversionCohortSupportCountTool;
