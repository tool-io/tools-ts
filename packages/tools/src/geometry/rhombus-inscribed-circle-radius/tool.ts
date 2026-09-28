import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDiagonal: number;
  readonly secondDiagonal: number;
};
export type Output = { readonly radius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDiagonal: { type: "number", exclusiveMinimum: 0 },
    secondDiagonal: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstDiagonal", "secondDiagonal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radius: { type: "number" } },
  required: ["radius"],
} as const;
/** Calculate rhombus inscribed circle radius from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstDiagonal, secondDiagonal } = input;
  const compute = (): Output => {
    H.positive(firstDiagonal);
    H.positive(secondDiagonal);
    return {
      radius:
        (firstDiagonal * secondDiagonal) /
        (2 * Math.hypot(firstDiagonal, secondDiagonal)),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstDiagonal: 6, secondDiagonal: 8 },
  output: { radius: 2.4 },
} satisfies ToolExample<Input, Output>;
export const rhombusInscribedCircleRadiusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/rhombus-inscribed-circle-radius",
    title: "Rhombus Inscribed Circle Radius Tool",
    description:
      "Calculate rhombus inscribed circle radius from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDiagonal: { type: "number", exclusiveMinimum: 0 },
        secondDiagonal: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstDiagonal", "secondDiagonal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radius: { type: "number" } },
      required: ["radius"],
    },
    ports: {
      inputs: [
        {
          id: "firstDiagonal",
          label: "First Diagonal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDiagonal",
          label: "Second Diagonal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "radius", label: "Radius", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rhombusInscribedCircleRadiusTool.execute;
export default rhombusInscribedCircleRadiusTool;
