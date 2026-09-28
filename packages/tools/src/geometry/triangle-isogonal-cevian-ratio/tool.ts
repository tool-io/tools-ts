import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly adjacentFirst: number;
  readonly adjacentSecond: number;
  readonly firstRatio: number;
};
export type Output = { readonly isogonalRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjacentFirst: { type: "number", exclusiveMinimum: 0 },
    adjacentSecond: { type: "number", exclusiveMinimum: 0 },
    firstRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["adjacentFirst", "adjacentSecond", "firstRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { isogonalRatio: { type: "number" } },
  required: ["isogonalRatio"],
} as const;
/** Calculate triangle isogonal cevian ratio from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { adjacentFirst, adjacentSecond, firstRatio } = input;
  const compute = (): Output => {
    H.positive(adjacentFirst);
    H.positive(adjacentSecond);
    H.positive(firstRatio);
    return {
      isogonalRatio: (adjacentFirst / adjacentSecond) ** 2 / firstRatio,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { adjacentFirst: 6, adjacentSecond: 3, firstRatio: 2 },
  output: { isogonalRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const triangleIsogonalCevianRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/triangle-isogonal-cevian-ratio",
    title: "Triangle Isogonal Cevian Ratio Tool",
    description:
      "Calculate triangle isogonal cevian ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjacentFirst: { type: "number", exclusiveMinimum: 0 },
        adjacentSecond: { type: "number", exclusiveMinimum: 0 },
        firstRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["adjacentFirst", "adjacentSecond", "firstRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { isogonalRatio: { type: "number" } },
      required: ["isogonalRatio"],
    },
    ports: {
      inputs: [
        {
          id: "adjacentFirst",
          label: "Adjacent First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "adjacentSecond",
          label: "Adjacent Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstRatio",
          label: "First Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "isogonalRatio",
          label: "Isogonal Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = triangleIsogonalCevianRatioTool.execute;
export default triangleIsogonalCevianRatioTool;
