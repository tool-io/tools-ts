import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellProbability: number;
  readonly referenceProbability: number;
};
export type Output = {
  readonly contributionNats: number;
  readonly zeroCellLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellProbability: { type: "number", minimum: 0, maximum: 1 },
    referenceProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["cellProbability", "referenceProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contributionNats: { type: "number" },
    zeroCellLimit: { type: "boolean" },
  },
  required: ["contributionNats", "zeroCellLimit"],
} as const;
/** Evaluate one p*ln(p/q) cell contribution with its continuous p→0 limit and positive supplied q. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellProbability, referenceProbability } = request;
  const compute = (): Output => {
    H.probability(cellProbability);
    H.domain(referenceProbability > 0 && referenceProbability <= 1);
    return {
      contributionNats:
        cellProbability === 0
          ? 0
          : cellProbability *
            (Math.log(cellProbability) - Math.log(referenceProbability)),
      zeroCellLimit: cellProbability === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cellProbability: 0, referenceProbability: 0.5 },
  output: { contributionNats: 0, zeroCellLimit: true },
} satisfies ToolExample<Input, Output>;
export const informationGainZeroCellLimitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/information-gain-zero-cell-limit",
    title: "Information Gain Zero Cell Limit Tool",
    description:
      "Evaluate one p*ln(p/q) cell contribution with its continuous p→0 limit and positive supplied q.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellProbability: { type: "number", minimum: 0, maximum: 1 },
        referenceProbability: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: ["cellProbability", "referenceProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contributionNats: { type: "number" },
        zeroCellLimit: { type: "boolean" },
      },
      required: ["contributionNats", "zeroCellLimit"],
    },
    ports: {
      inputs: [
        {
          id: "cellProbability",
          label: "Cell Probability",
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
        {
          id: "contributionNats",
          label: "Contribution Nats",
          valueType: { type: "number" },
        },
        {
          id: "zeroCellLimit",
          label: "Zero Cell Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = informationGainZeroCellLimitTool.execute;
export default informationGainZeroCellLimitTool;
