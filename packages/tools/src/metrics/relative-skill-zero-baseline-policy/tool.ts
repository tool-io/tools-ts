import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly loss: number;
  readonly baseline: number;
  readonly zeroValue: number;
};
export type Output = { readonly defined: boolean; readonly score: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loss: { type: "number" },
    baseline: { type: "number" },
    zeroValue: { type: "number" },
  },
  required: ["loss", "baseline", "zeroValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, score: { type: "number" } },
  required: ["defined", "score"],
} as const;
/** Compute relative skill zero baseline policy from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { loss, baseline, zeroValue } = input;
  const compute = (): Output => {
    domain(loss >= 0 && baseline >= 0);
    return {
      defined: baseline !== 0,
      score: baseline === 0 ? zeroValue : 1 - loss / baseline,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { loss: 0, baseline: 0, zeroValue: 0 },
  output: { defined: false, score: 0 },
} satisfies ToolExample<Input, Output>;
export const relativeSkillZeroBaselinePolicyTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "metrics/relative-skill-zero-baseline-policy",
  title: "Relative Skill Zero Baseline Policy Tool",
  description:
    "Compute relative skill zero baseline policy from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "loss",
        label: "Loss",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "baseline",
        label: "Baseline",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "zeroValue",
        label: "Zero Value",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      { id: "score", label: "Score", valueType: { type: "number" } },
    ],
  },
});
export const run = relativeSkillZeroBaselinePolicyTool.execute;
export default relativeSkillZeroBaselinePolicyTool;
