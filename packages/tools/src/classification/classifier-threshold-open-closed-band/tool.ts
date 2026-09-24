import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly score: number;
  readonly lower: number;
  readonly upper: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = { readonly inside: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number", minimum: 0, maximum: 1 },
    lower: { type: "number", minimum: 0, maximum: 1 },
    upper: { type: "number", minimum: 0, maximum: 1 },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["score", "lower", "upper", "includeLower", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { inside: { type: "boolean" } },
  required: ["inside"],
} as const;
/** Compute classifier threshold open closed band from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { score, lower, upper, includeLower, includeUpper } = input;
  const compute = (): Output => {
    probability(score);
    probability(lower);
    probability(upper);
    domain(lower <= upper);
    return {
      inside:
        (score > lower || (includeLower && score === lower)) &&
        (score < upper || (includeUpper && score === upper)),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    score: 0.25,
    lower: 0.25,
    upper: 0.75,
    includeLower: true,
    includeUpper: false,
  },
  output: { inside: true },
} satisfies ToolExample<Input, Output>;
export const classifierThresholdOpenClosedBandTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/classifier-threshold-open-closed-band",
  title: "Classifier Threshold Open Closed Band Tool",
  description:
    "Compute classifier threshold open closed band from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "score",
        label: "Score",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "lower",
        label: "Lower",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "upper",
        label: "Upper",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "includeLower",
        label: "Include Lower",
        required: true,
        valueType: { type: "boolean" },
      },
      {
        id: "includeUpper",
        label: "Include Upper",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      { id: "inside", label: "Inside", valueType: { type: "boolean" } },
    ],
  },
});
export const run = classifierThresholdOpenClosedBandTool.execute;
export default classifierThresholdOpenClosedBandTool;
