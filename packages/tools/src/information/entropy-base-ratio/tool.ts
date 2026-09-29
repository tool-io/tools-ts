import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceBase: number;
  readonly targetBase: number;
};
export type Output = { readonly factor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceBase: { type: "number", exclusiveMinimum: 0 },
    targetBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceBase", "targetBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { factor: { type: "number" } },
  required: ["factor"],
} as const;
/** Convert entropy values from one explicit logarithm base to another using the log-base ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceBase, targetBase } = request;
  const compute = (): Output => {
    H.domain(
      sourceBase > 0 && sourceBase !== 1 && targetBase > 0 && targetBase !== 1,
    );
    return { factor: Math.log(sourceBase) / Math.log(targetBase) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceBase: 2, targetBase: 4 },
  output: { factor: 0.5 },
} satisfies ToolExample<Input, Output>;
export const entropyBaseRatioTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "information/entropy-base-ratio",
    title: "Entropy Base Ratio Tool",
    description:
      "Convert entropy values from one explicit logarithm base to another using the log-base ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceBase: { type: "number", exclusiveMinimum: 0 },
        targetBase: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sourceBase", "targetBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { factor: { type: "number" } },
      required: ["factor"],
    },
    ports: {
      inputs: [
        {
          id: "sourceBase",
          label: "Source Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetBase",
          label: "Target Base",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "factor", label: "Factor", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = entropyBaseRatioTool.execute;
export default entropyBaseRatioTool;
