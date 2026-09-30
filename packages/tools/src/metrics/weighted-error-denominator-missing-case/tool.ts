import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedWeight: number;
  readonly missingWeight: number;
  readonly includeMissing: boolean;
};
export type Output = { readonly denominator: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedWeight: { type: "number", minimum: 0 },
    missingWeight: { type: "number", minimum: 0 },
    includeMissing: { type: "boolean" },
  },
  required: ["observedWeight", "missingWeight", "includeMissing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { denominator: { type: "number" } },
  required: ["denominator"],
} as const;
/** Calculate weighted error denominator missing case from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { observedWeight, missingWeight, includeMissing } = input;
  const compute = (): Output => {
    H.domain(observedWeight >= 0 && missingWeight >= 0);
    return {
      denominator: observedWeight + (includeMissing ? missingWeight : 0),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { observedWeight: 8, missingWeight: 2, includeMissing: false },
  output: { denominator: 8 },
} satisfies ToolExample<Input, Output>;
export const weightedErrorDenominatorMissingCaseTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "metrics/weighted-error-denominator-missing-case",
      title: "Weighted Error Denominator Missing Case Tool",
      description:
        "Calculate weighted error denominator missing case from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedWeight: { type: "number", minimum: 0 },
          missingWeight: { type: "number", minimum: 0 },
          includeMissing: { type: "boolean" },
        },
        required: ["observedWeight", "missingWeight", "includeMissing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { denominator: { type: "number" } },
        required: ["denominator"],
      },
      ports: {
        inputs: [
          {
            id: "observedWeight",
            label: "Observed Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "missingWeight",
            label: "Missing Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeMissing",
            label: "Include Missing",
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
        ],
      },
    },
    calculate,
  });
export const run = weightedErrorDenominatorMissingCaseTool.execute;
export default weightedErrorDenominatorMissingCaseTool;
