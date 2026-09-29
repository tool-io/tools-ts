import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  positive,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly joint: number;
  readonly xz: number;
  readonly yz: number;
  readonly z: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    joint: { type: "number", minimum: 0, maximum: 1 },
    xz: { type: "number", minimum: 0, maximum: 1 },
    yz: { type: "number", minimum: 0, maximum: 1 },
    z: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["joint", "xz", "yz", "z"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Compute conditional mutual information one cell from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { joint, xz, yz, z } = input;
  const compute = (): Output => {
    probability(joint);
    probability(xz);
    probability(yz);
    probability(z);
    domain(joint <= xz && joint <= yz && xz <= z && yz <= z);
    if (joint === 0) return { contribution: 0 };
    positive(xz * yz * z);
    return { contribution: joint * Math.log2((joint * z) / (xz * yz)) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { joint: 0.25, xz: 0.5, yz: 0.5, z: 1 },
  output: { contribution: 0 },
} satisfies ToolExample<Input, Output>;
export const conditionalMutualInformationOneCellTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "information/conditional-mutual-information-one-cell",
  title: "Conditional Mutual Information One Cell Tool",
  description:
    "Compute conditional mutual information one cell from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "joint",
        label: "Joint",
        required: true,
        valueType: { type: "number" },
      },
      { id: "xz", label: "Xz", required: true, valueType: { type: "number" } },
      { id: "yz", label: "Yz", required: true, valueType: { type: "number" } },
      { id: "z", label: "Z", required: true, valueType: { type: "number" } },
    ],
    outputs: [
      {
        id: "contribution",
        label: "Contribution",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = conditionalMutualInformationOneCellTool.execute;
export default conditionalMutualInformationOneCellTool;
