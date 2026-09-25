import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposures: readonly number[];
  readonly survivalFractions: readonly number[];
  readonly observed: readonly boolean[];
};
export type Output = {
  readonly expectedSurvivingExposure: number;
  readonly observedExpectedExposure: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposures: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    survivalFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["exposures", "survivalFractions", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedSurvivingExposure: { type: "number" },
    observedExpectedExposure: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "expectedSurvivingExposure",
    "observedExpectedExposure",
    "share",
    "defined",
  ],
} as const;
/** Calculate cohort survival exposure share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposures, survivalFractions, observed } = request;
  const compute = (): Output => {
    H.sameLength(exposures, survivalFractions);
    H.sameLength(exposures, observed);
    H.domain(
      exposures.every((x) => x >= 0) &&
        survivalFractions.every((x) => x >= 0 && x <= 1),
    );
    return (() => {
      const expectedSurvivingExposure = exposures.reduce(
          (s, x, i) => s + x * survivalFractions[i],
          0,
        ),
        observedExpectedExposure = exposures.reduce(
          (s, x, i) => s + (observed[i] ? x * survivalFractions[i] : 0),
          0,
        );
      return {
        expectedSurvivingExposure,
        observedExpectedExposure,
        share:
          expectedSurvivingExposure > 0
            ? observedExpectedExposure / expectedSurvivingExposure
            : 0,
        defined: expectedSurvivingExposure > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    exposures: [10, 20],
    survivalFractions: [0.5, 0.75],
    observed: [true, false],
  },
  output: {
    expectedSurvivingExposure: 20,
    observedExpectedExposure: 5,
    share: 0.25,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const cohortSurvivalExposureShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/cohort-survival-exposure-share",
    title: "Cohort Survival Exposure Share Tool",
    description:
      "Calculate cohort survival exposure share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposures: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        survivalFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["exposures", "survivalFractions", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedSurvivingExposure: { type: "number" },
        observedExpectedExposure: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "expectedSurvivingExposure",
        "observedExpectedExposure",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "exposures",
          label: "Exposures",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "survivalFractions",
          label: "Survival Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "expectedSurvivingExposure",
          label: "Expected Surviving Exposure",
          valueType: { type: "number" },
        },
        {
          id: "observedExpectedExposure",
          label: "Observed Expected Exposure",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = cohortSurvivalExposureShareTool.execute;
export default cohortSurvivalExposureShareTool;
