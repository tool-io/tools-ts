import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly target: number;
};
export type Output = { readonly parameter: number; readonly onEdge: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    target: { type: "number" },
  },
  required: ["first", "second", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parameter: { type: "number" }, onEdge: { type: "boolean" } },
  required: ["parameter", "onEdge"],
} as const;
/** Calculate bilinear level set edge intersection from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, target } = input;
  const compute = (): Output => {
    H.domain(first !== second);
    const parameter = (target - first) / (second - first);
    return { parameter, onEdge: parameter >= 0 && parameter <= 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 2, second: 6, target: 3 },
  output: { parameter: 0.25, onEdge: true },
} satisfies ToolExample<Input, Output>;
export const bilinearLevelSetEdgeIntersectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/bilinear-level-set-edge-intersection",
    title: "Bilinear Level Set Edge Intersection Tool",
    description:
      "Calculate bilinear level set edge intersection from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        target: { type: "number" },
      },
      required: ["first", "second", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parameter: { type: "number" },
        onEdge: { type: "boolean" },
      },
      required: ["parameter", "onEdge"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "parameter", label: "Parameter", valueType: { type: "number" } },
        { id: "onEdge", label: "On Edge", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = bilinearLevelSetEdgeIntersectionTool.execute;
export default bilinearLevelSetEdgeIntersectionTool;
