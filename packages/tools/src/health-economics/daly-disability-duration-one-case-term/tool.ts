import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly disabilityWeight: number;
  readonly durationYears: number;
  readonly caseCount: number;
};
export type Output = { readonly yldPerCase: number; readonly totalYld: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disabilityWeight: { type: "number", minimum: 0, maximum: 1 },
    durationYears: { type: "number", minimum: 0 },
    caseCount: { type: "number", minimum: 0 },
  },
  required: ["disabilityWeight", "durationYears", "caseCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { yldPerCase: { type: "number" }, totalYld: { type: "number" } },
  required: ["yldPerCase", "totalYld"],
} as const;
/** Prevalence-duration years lived with disability only; excludes YLL, age weighting and comorbidity adjustments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { disabilityWeight, durationYears, caseCount } = request;
  const compute = (): Output => {
    H.probability(disabilityWeight);
    H.domain(durationYears >= 0 && caseCount >= 0);
    return {
      yldPerCase: disabilityWeight * durationYears,
      totalYld: disabilityWeight * durationYears * caseCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { disabilityWeight: 0.2, durationYears: 5, caseCount: 10 },
  output: { yldPerCase: 1, totalYld: 10 },
} satisfies ToolExample<Input, Output>;
export const dalyDisabilityDurationOneCaseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/daly-disability-duration-one-case-term",
    title: "Daly Disability Duration One Case Term Tool",
    description:
      "Prevalence-duration years lived with disability only; excludes YLL, age weighting and comorbidity adjustments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        disabilityWeight: { type: "number", minimum: 0, maximum: 1 },
        durationYears: { type: "number", minimum: 0 },
        caseCount: { type: "number", minimum: 0 },
      },
      required: ["disabilityWeight", "durationYears", "caseCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yldPerCase: { type: "number" },
        totalYld: { type: "number" },
      },
      required: ["yldPerCase", "totalYld"],
    },
    ports: {
      inputs: [
        {
          id: "disabilityWeight",
          label: "Disability Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationYears",
          label: "Duration Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "caseCount",
          label: "Case Count",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "yldPerCase",
          label: "Yld Per Case",
          valueType: { type: "number" },
        },
        { id: "totalYld", label: "Total Yld", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = dalyDisabilityDurationOneCaseTermTool.execute;
export default dalyDisabilityDurationOneCaseTermTool;
