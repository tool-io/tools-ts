import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceLines: number;
  readonly targetLines: number;
};
export type Output = {
  readonly ratio: number;
  readonly additionalLines: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceLines: { type: "integer", minimum: 1 },
    targetLines: { type: "integer", minimum: 0 },
  },
  required: ["sourceLines", "targetLines"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    additionalLines: { type: "integer" },
  },
  required: ["ratio", "additionalLines"],
} as const;
/** Calculate parallel poem line expansion ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceLines, targetLines } = request;
  const compute = (): Output => {
    H.integer(sourceLines, 1);
    H.integer(targetLines, 0);
    return {
      ratio: targetLines / sourceLines,
      additionalLines: targetLines - sourceLines,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceLines: 12, targetLines: 18 },
  output: { ratio: 1.5, additionalLines: 6 },
} satisfies ToolExample<Input, Output>;
export const parallelPoemLineExpansionRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/parallel-poem-line-expansion-ratio",
    title: "Parallel Poem Line Expansion Ratio Tool",
    description:
      "Calculate parallel poem line expansion ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceLines: { type: "integer", minimum: 1 },
        targetLines: { type: "integer", minimum: 0 },
      },
      required: ["sourceLines", "targetLines"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        additionalLines: { type: "integer" },
      },
      required: ["ratio", "additionalLines"],
    },
    ports: {
      inputs: [
        {
          id: "sourceLines",
          label: "Source Lines",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetLines",
          label: "Target Lines",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "additionalLines",
          label: "Additional Lines",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = parallelPoemLineExpansionRatioTool.execute;
export default parallelPoemLineExpansionRatioTool;
