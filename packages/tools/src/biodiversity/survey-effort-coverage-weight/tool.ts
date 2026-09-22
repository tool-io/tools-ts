import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualEffort: number;
  readonly referenceEffort: number;
};
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualEffort: { type: "number", minimum: 0 },
    referenceEffort: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actualEffort", "referenceEffort"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
/** Calculate survey effort coverage weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualEffort, referenceEffort } = request;
  const compute = (): Output => {
    H.domain(actualEffort >= 0);
    H.positive(referenceEffort);
    return { weight: actualEffort / referenceEffort };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualEffort: 3, referenceEffort: 12 },
  output: { weight: 0.25 },
} satisfies ToolExample<Input, Output>;
export const surveyEffortCoverageWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/survey-effort-coverage-weight",
    title: "Survey Effort Coverage Weight Tool",
    description:
      "Calculate survey effort coverage weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualEffort: { type: "number", minimum: 0 },
        referenceEffort: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["actualEffort", "referenceEffort"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        {
          id: "actualEffort",
          label: "Actual Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceEffort",
          label: "Reference Effort",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = surveyEffortCoverageWeightTool.execute;
export default surveyEffortCoverageWeightTool;
