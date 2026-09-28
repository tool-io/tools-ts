import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly degree: number;
  readonly leftStubs: number;
  readonly connectingEdge: boolean;
};
export type Output = {
  readonly leftDegree: number;
  readonly rightDegree: number;
  readonly totalDegree: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degree: { type: "integer", minimum: 0 },
    leftStubs: { type: "integer", minimum: 0 },
    connectingEdge: { type: "boolean" },
  },
  required: ["degree", "leftStubs", "connectingEdge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftDegree: { type: "integer" },
    rightDegree: { type: "integer" },
    totalDegree: { type: "integer" },
  },
  required: ["leftDegree", "rightDegree", "totalDegree"],
} as const;
/** Compute graph vertex split degree balance from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { degree, leftStubs, connectingEdge } = input;
  const compute = (): Output => {
    integer(degree);
    integer(leftStubs, 0, degree);
    const e = connectingEdge ? 1 : 0;
    return {
      leftDegree: leftStubs + e,
      rightDegree: degree - leftStubs + e,
      totalDegree: degree + 2 * e,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { degree: 5, leftStubs: 2, connectingEdge: true },
  output: { leftDegree: 3, rightDegree: 4, totalDegree: 7 },
} satisfies ToolExample<Input, Output>;
export const graphVertexSplitDegreeBalanceTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "graph/graph-vertex-split-degree-balance",
  title: "Graph Vertex Split Degree Balance Tool",
  description:
    "Compute graph vertex split degree balance from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "degree",
        label: "Degree",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "leftStubs",
        label: "Left Stubs",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "connectingEdge",
        label: "Connecting Edge",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "leftDegree",
        label: "Left Degree",
        valueType: { type: "integer" },
      },
      {
        id: "rightDegree",
        label: "Right Degree",
        valueType: { type: "integer" },
      },
      {
        id: "totalDegree",
        label: "Total Degree",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = graphVertexSplitDegreeBalanceTool.execute;
export default graphVertexSplitDegreeBalanceTool;
