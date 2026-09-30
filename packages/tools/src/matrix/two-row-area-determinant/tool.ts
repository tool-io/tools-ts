import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstX: number;
  readonly firstY: number;
  readonly secondX: number;
  readonly secondY: number;
};
export type Output = {
  readonly signedDeterminant: number;
  readonly absoluteArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstX: { type: "number" },
    firstY: { type: "number" },
    secondX: { type: "number" },
    secondY: { type: "number" },
  },
  required: ["firstX", "firstY", "secondX", "secondY"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDeterminant: { type: "number" },
    absoluteArea: { type: "number" },
  },
  required: ["signedDeterminant", "absoluteArea"],
} as const;
/** Calculate two row area determinant from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstX, firstY, secondX, secondY } = request;
  const compute = (): Output => {
    return {
      signedDeterminant: firstX * secondY - firstY * secondX,
      absoluteArea: Math.abs(firstX * secondY - firstY * secondX),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstX: 2, firstY: 1, secondX: 1, secondY: 3 },
  output: { signedDeterminant: 5, absoluteArea: 5 },
} satisfies ToolExample<Input, Output>;
export const twoRowAreaDeterminantTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/two-row-area-determinant",
    title: "Two Row Area Determinant Tool",
    description:
      "Calculate two row area determinant from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstX: { type: "number" },
        firstY: { type: "number" },
        secondX: { type: "number" },
        secondY: { type: "number" },
      },
      required: ["firstX", "firstY", "secondX", "secondY"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDeterminant: { type: "number" },
        absoluteArea: { type: "number" },
      },
      required: ["signedDeterminant", "absoluteArea"],
    },
    ports: {
      inputs: [
        {
          id: "firstX",
          label: "First X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstY",
          label: "First Y",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondX",
          label: "Second X",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondY",
          label: "Second Y",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDeterminant",
          label: "Signed Determinant",
          valueType: { type: "number" },
        },
        {
          id: "absoluteArea",
          label: "Absolute Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = twoRowAreaDeterminantTool.execute;
export default twoRowAreaDeterminantTool;
