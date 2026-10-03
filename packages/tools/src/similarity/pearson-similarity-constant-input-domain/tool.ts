import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVariance: number;
  readonly secondVariance: number;
};
export type Output = {
  readonly defined: boolean;
  readonly constantFirst: boolean;
  readonly constantSecond: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVariance: { type: "number", minimum: 0 },
    secondVariance: { type: "number", minimum: 0 },
  },
  required: ["firstVariance", "secondVariance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    defined: { type: "boolean" },
    constantFirst: { type: "boolean" },
    constantSecond: { type: "boolean" },
  },
  required: ["defined", "constantFirst", "constantSecond"],
} as const;
/** Calculate pearson similarity constant input domain from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVariance, secondVariance } = request;
  const compute = (): Output => {
    H.domain(firstVariance >= 0 && secondVariance >= 0);
    return {
      defined: firstVariance > 0 && secondVariance > 0,
      constantFirst: firstVariance === 0,
      constantSecond: secondVariance === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstVariance: 0, secondVariance: 2 },
  output: { defined: false, constantFirst: true, constantSecond: false },
} satisfies ToolExample<Input, Output>;
export const pearsonSimilarityConstantInputDomainTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/pearson-similarity-constant-input-domain",
      title: "Pearson Similarity Constant Input Domain Tool",
      description:
        "Calculate pearson similarity constant input domain from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstVariance: { type: "number", minimum: 0 },
          secondVariance: { type: "number", minimum: 0 },
        },
        required: ["firstVariance", "secondVariance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          defined: { type: "boolean" },
          constantFirst: { type: "boolean" },
          constantSecond: { type: "boolean" },
        },
        required: ["defined", "constantFirst", "constantSecond"],
      },
      ports: {
        inputs: [
          {
            id: "firstVariance",
            label: "First Variance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondVariance",
            label: "Second Variance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
          {
            id: "constantFirst",
            label: "Constant First",
            valueType: { type: "boolean" },
          },
          {
            id: "constantSecond",
            label: "Constant Second",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pearsonSimilarityConstantInputDomainTool.execute;
export default pearsonSimilarityConstantInputDomainTool;
