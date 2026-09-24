import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly masses: readonly number[];
  readonly tolerance: number;
};
export type Output = { readonly gap: number; readonly acceptable: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    masses: { type: "array", maxItems: 256, items: { type: "number" } },
    tolerance: { type: "number" },
  },
  required: ["masses", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, acceptable: { type: "boolean" } },
  required: ["gap", "acceptable"],
} as const;
/** Compute classifier probability sum roundoff gap from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { masses, tolerance } = input;
  const compute = (): Output => {
    domain(masses.every((x) => x >= 0 && x <= 1) && tolerance >= 0);
    const gap = 1 - masses.reduce((a, b) => a + b, 0);
    return { gap, acceptable: Math.abs(gap) <= tolerance };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { masses: [0.25, 0.5], tolerance: 0.01 },
  output: { gap: 0.25, acceptable: false },
} satisfies ToolExample<Input, Output>;
export const classifierProbabilitySumRoundoffGapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/classifier-probability-sum-roundoff-gap",
  title: "Classifier Probability Sum Roundoff Gap Tool",
  description:
    "Compute classifier probability sum roundoff gap from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "masses",
        label: "Masses",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "tolerance",
        label: "Tolerance",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "gap", label: "Gap", valueType: { type: "number" } },
      { id: "acceptable", label: "Acceptable", valueType: { type: "boolean" } },
    ],
  },
});
export const run = classifierProbabilitySumRoundoffGapTool.execute;
export default classifierProbabilitySumRoundoffGapTool;
