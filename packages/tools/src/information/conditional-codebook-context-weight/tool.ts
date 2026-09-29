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
  readonly contextMass: number;
  readonly conditionalLength: number;
};
export type Output = { readonly weightedLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contextMass: { type: "number", minimum: 0, maximum: 1 },
    conditionalLength: { type: "number" },
  },
  required: ["contextMass", "conditionalLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedLength: { type: "number" } },
  required: ["weightedLength"],
} as const;
/** Compute conditional codebook context weight from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { contextMass, conditionalLength } = input;
  const compute = (): Output => {
    probability(contextMass);
    domain(conditionalLength >= 0);
    return { weightedLength: contextMass * conditionalLength };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { contextMass: 0.25, conditionalLength: 8 },
  output: { weightedLength: 2 },
} satisfies ToolExample<Input, Output>;
export const conditionalCodebookContextWeightTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "information/conditional-codebook-context-weight",
  title: "Conditional Codebook Context Weight Tool",
  description:
    "Compute conditional codebook context weight from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "contextMass",
        label: "Context Mass",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "conditionalLength",
        label: "Conditional Length",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "weightedLength",
        label: "Weighted Length",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = conditionalCodebookContextWeightTool.execute;
export default conditionalCodebookContextWeightTool;
