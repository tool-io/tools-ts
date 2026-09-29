import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceProbability: number;
  readonly referenceProbability: number;
};
export type Output = {
  readonly infinite: boolean;
  readonly zeroContribution: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceProbability: { type: "number", minimum: 0, maximum: 1 },
    referenceProbability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["sourceProbability", "referenceProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    infinite: { type: "boolean" },
    zeroContribution: { type: "boolean" },
  },
  required: ["infinite", "zeroContribution"],
} as const;
/** Calculate cross entropy reference zero support flag from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { sourceProbability, referenceProbability } = input;
  const compute = (): Output => {
    H.probability(sourceProbability);
    H.probability(referenceProbability);
    return {
      infinite: sourceProbability > 0 && referenceProbability === 0,
      zeroContribution: sourceProbability === 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sourceProbability: 0.25, referenceProbability: 0 },
  output: { infinite: true, zeroContribution: false },
} satisfies ToolExample<Input, Output>;
export const crossEntropyReferenceZeroSupportFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information/cross-entropy-reference-zero-support-flag",
      title: "Cross Entropy Reference Zero Support Flag Tool",
      description:
        "Calculate cross entropy reference zero support flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceProbability: { type: "number", minimum: 0, maximum: 1 },
          referenceProbability: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["sourceProbability", "referenceProbability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          infinite: { type: "boolean" },
          zeroContribution: { type: "boolean" },
        },
        required: ["infinite", "zeroContribution"],
      },
      ports: {
        inputs: [
          {
            id: "sourceProbability",
            label: "Source Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceProbability",
            label: "Reference Probability",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "infinite", label: "Infinite", valueType: { type: "boolean" } },
          {
            id: "zeroContribution",
            label: "Zero Contribution",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = crossEntropyReferenceZeroSupportFlagTool.execute;
export default crossEntropyReferenceZeroSupportFlagTool;
