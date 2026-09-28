import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDegree: number;
  readonly secondDegree: number;
};
export type Output = { readonly degree: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDegree: { type: "integer", minimum: 0 },
    secondDegree: { type: "integer", minimum: 0 },
  },
  required: ["firstDegree", "secondDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { degree: { type: "integer" } },
  required: ["degree"],
} as const;
/** Calculate graph cartesian product degree term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDegree, secondDegree } = request;
  const compute = (): Output => {
    H.integer(firstDegree, 0);
    H.integer(secondDegree, 0);
    return { degree: firstDegree + secondDegree };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDegree: 3, secondDegree: 4 },
  output: { degree: 7 },
} satisfies ToolExample<Input, Output>;
export const graphCartesianProductDegreeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/graph-cartesian-product-degree-term",
    title: "Graph Cartesian Product Degree Term Tool",
    description:
      "Calculate graph cartesian product degree term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDegree: { type: "integer", minimum: 0 },
        secondDegree: { type: "integer", minimum: 0 },
      },
      required: ["firstDegree", "secondDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { degree: { type: "integer" } },
      required: ["degree"],
    },
    ports: {
      inputs: [
        {
          id: "firstDegree",
          label: "First Degree",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondDegree",
          label: "Second Degree",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "degree", label: "Degree", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = graphCartesianProductDegreeTermTool.execute;
export default graphCartesianProductDegreeTermTool;
