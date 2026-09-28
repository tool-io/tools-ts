import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstColor: string;
  readonly secondColor: string;
};
export type Output = { readonly conflict: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstColor: { type: "string", maxLength: 8192 },
    secondColor: { type: "string", maxLength: 8192 },
  },
  required: ["firstColor", "secondColor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { conflict: { type: "boolean" } },
  required: ["conflict"],
} as const;
/** Calculate graph color single edge conflict from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstColor, secondColor } = request;
  const compute = (): Output => {
    return { conflict: firstColor === secondColor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstColor: "red", secondColor: "red" },
  output: { conflict: true },
} satisfies ToolExample<Input, Output>;
export const graphColorSingleEdgeConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/graph-color-single-edge-conflict",
    title: "Graph Color Single Edge Conflict Tool",
    description:
      "Calculate graph color single edge conflict from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstColor: { type: "string", maxLength: 8192 },
        secondColor: { type: "string", maxLength: 8192 },
      },
      required: ["firstColor", "secondColor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { conflict: { type: "boolean" } },
      required: ["conflict"],
    },
    ports: {
      inputs: [
        {
          id: "firstColor",
          label: "First Color",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondColor",
          label: "Second Color",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "conflict", label: "Conflict", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = graphColorSingleEdgeConflictTool.execute;
export default graphColorSingleEdgeConflictTool;
