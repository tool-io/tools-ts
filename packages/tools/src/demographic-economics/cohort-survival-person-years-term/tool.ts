import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohortCount: number;
  readonly survivalFraction: number;
  readonly exposureYears: number;
};
export type Output = {
  readonly survivors: number;
  readonly survivorPersonYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohortCount: { type: "number", minimum: 0 },
    survivalFraction: { type: "number", minimum: 0, maximum: 1 },
    exposureYears: { type: "number", minimum: 0 },
  },
  required: ["cohortCount", "survivalFraction", "exposureYears"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    survivors: { type: "number" },
    survivorPersonYears: { type: "number" },
  },
  required: ["survivors", "survivorPersonYears"],
} as const;
/** Calculate explicit survivor count times exposure years under an all-survivors-full-period convention, excluding exposure of nonsurvivors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohortCount, survivalFraction, exposureYears } = request;
  const compute = (): Output => {
    H.domain(cohortCount >= 0, "cohortCount");
    (H.domain(
      survivalFraction >= 0 && survivalFraction <= 1,
      "survivalFraction",
    ),
      survivalFraction);
    H.domain(exposureYears >= 0, "exposureYears");
    return {
      survivors: cohortCount * survivalFraction,
      survivorPersonYears: cohortCount * survivalFraction * exposureYears,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cohortCount: 100, survivalFraction: 0.8, exposureYears: 2 },
  output: { survivors: 80, survivorPersonYears: 160 },
} satisfies ToolExample<Input, Output>;
export const cohortSurvivalPersonYearsTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/cohort-survival-person-years-term",
    title: "Cohort Survival Person Years Term Tool",
    description:
      "Calculate explicit survivor count times exposure years under an all-survivors-full-period convention, excluding exposure of nonsurvivors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cohortCount: { type: "number", minimum: 0 },
        survivalFraction: { type: "number", minimum: 0, maximum: 1 },
        exposureYears: { type: "number", minimum: 0 },
      },
      required: ["cohortCount", "survivalFraction", "exposureYears"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        survivors: { type: "number" },
        survivorPersonYears: { type: "number" },
      },
      required: ["survivors", "survivorPersonYears"],
    },
    ports: {
      inputs: [
        {
          id: "cohortCount",
          label: "Cohort Count",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "survivalFraction",
          label: "Survival Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposureYears",
          label: "Exposure Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "survivors", label: "Survivors", valueType: { type: "number" } },
        {
          id: "survivorPersonYears",
          label: "Survivor Person Years",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cohortSurvivalPersonYearsTermTool.execute;
export default cohortSurvivalPersonYearsTermTool;
