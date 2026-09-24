import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probability: number;
  readonly lower: number;
  readonly upper: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export type Output = { readonly abstain: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", minimum: 0, maximum: 1 },
    lower: { type: "number", minimum: 0, maximum: 1 },
    upper: { type: "number", minimum: 0, maximum: 1 },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["probability", "lower", "upper", "includeLower", "includeUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { abstain: { type: "boolean" } },
  required: ["abstain"],
} as const;
/** Calculate binary abstention indicator from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, lower, upper, includeLower, includeUpper } = request;
  const compute = (): Output => {
    H.probability(probability);
    H.probability(lower);
    H.probability(upper);
    H.domain(lower <= upper);
    return {
      abstain:
        (includeLower ? probability >= lower : probability > lower) &&
        (includeUpper ? probability <= upper : probability < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    probability: 0.5,
    lower: 0.4,
    upper: 0.6,
    includeLower: true,
    includeUpper: true,
  },
  output: { abstain: true },
} satisfies ToolExample<Input, Output>;
export const binaryAbstentionIndicatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/binary-abstention-indicator",
    title: "Binary Abstention Indicator Tool",
    description:
      "Calculate binary abstention indicator from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", minimum: 0, maximum: 1 },
        lower: { type: "number", minimum: 0, maximum: 1 },
        upper: { type: "number", minimum: 0, maximum: 1 },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: [
        "probability",
        "lower",
        "upper",
        "includeLower",
        "includeUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { abstain: { type: "boolean" } },
      required: ["abstain"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
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
        { id: "abstain", label: "Abstain", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = binaryAbstentionIndicatorTool.execute;
export default binaryAbstentionIndicatorTool;
