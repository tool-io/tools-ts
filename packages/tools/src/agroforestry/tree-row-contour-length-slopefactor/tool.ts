import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly horizontalLength: number;
  readonly grade: number;
};
export type Output = { readonly surfaceLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    horizontalLength: { type: "number", minimum: 0 },
    grade: { type: "number" },
  },
  required: ["horizontalLength", "grade"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { surfaceLength: { type: "number" } },
  required: ["surfaceLength"],
} as const;
/** Calculate tree row contour length slopefactor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { horizontalLength, grade } = request;
  const compute = (): Output => {
    H.domain(horizontalLength >= 0);
    return { surfaceLength: horizontalLength * Math.hypot(1, grade) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { horizontalLength: 100, grade: 0.1 },
  output: { surfaceLength: 100.4987562112089 },
} satisfies ToolExample<Input, Output>;
export const treeRowContourLengthSlopefactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-row-contour-length-slopefactor",
    title: "Tree Row Contour Length Slopefactor Tool",
    description:
      "Calculate tree row contour length slopefactor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        horizontalLength: { type: "number", minimum: 0 },
        grade: { type: "number" },
      },
      required: ["horizontalLength", "grade"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { surfaceLength: { type: "number" } },
      required: ["surfaceLength"],
    },
    ports: {
      inputs: [
        {
          id: "horizontalLength",
          label: "Horizontal Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grade",
          label: "Grade",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "surfaceLength",
          label: "Surface Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeRowContourLengthSlopefactorTool.execute;
export default treeRowContourLengthSlopefactorTool;
