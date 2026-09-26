import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedC: number;
  readonly referenceC: number;
  readonly toleranceC: number;
};
export type Output = {
  readonly differenceC: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedC: { type: "number", minimum: -273.15 },
    referenceC: { type: "number", minimum: -273.15 },
    toleranceC: { type: "number", minimum: 0 },
  },
  required: ["observedC", "referenceC", "toleranceC"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    differenceC: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["differenceC", "withinTolerance"],
} as const;
/** Calculate insect survey temperature reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedC, referenceC, toleranceC } = request;
  const compute = (): Output => {
    H.domain(observedC >= -273.15 && referenceC >= -273.15 && toleranceC >= 0);
    return {
      differenceC: observedC - referenceC,
      withinTolerance: Math.abs(observedC - referenceC) <= toleranceC,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedC: 23, referenceC: 20, toleranceC: 2 },
  output: { differenceC: 3, withinTolerance: false },
} satisfies ToolExample<Input, Output>;
export const insectSurveyTemperatureReferenceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entomology/insect-survey-temperature-reference-gap",
      title: "Insect Survey Temperature Reference Gap Tool",
      description:
        "Calculate insect survey temperature reference gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedC: { type: "number", minimum: -273.15 },
          referenceC: { type: "number", minimum: -273.15 },
          toleranceC: { type: "number", minimum: 0 },
        },
        required: ["observedC", "referenceC", "toleranceC"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          differenceC: { type: "number" },
          withinTolerance: { type: "boolean" },
        },
        required: ["differenceC", "withinTolerance"],
      },
      ports: {
        inputs: [
          {
            id: "observedC",
            label: "Observed C",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceC",
            label: "Reference C",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "toleranceC",
            label: "Tolerance C",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "differenceC",
            label: "Difference C",
            valueType: { type: "number" },
          },
          {
            id: "withinTolerance",
            label: "Within Tolerance",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = insectSurveyTemperatureReferenceGapTool.execute;
export default insectSurveyTemperatureReferenceGapTool;
