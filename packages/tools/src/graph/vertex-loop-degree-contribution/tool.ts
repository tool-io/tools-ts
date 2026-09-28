import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loopCount: number;
  readonly directed: boolean;
  readonly countTotalDirectedDegree: boolean;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loopCount: { type: "integer", minimum: 0 },
    directed: { type: "boolean" },
    countTotalDirectedDegree: { type: "boolean" },
  },
  required: ["loopCount", "directed", "countTotalDirectedDegree"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "integer" } },
  required: ["contribution"],
} as const;
/** Return the loop incidence contribution under explicit undirected, single directed in/out, or total directed degree conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loopCount, directed, countTotalDirectedDegree } = request;
  const compute = (): Output => {
    H.integer(loopCount, 0);
    return {
      contribution: Number(
        BigInt(loopCount) *
          BigInt(directed && !countTotalDirectedDegree ? 1 : 2),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loopCount: 3, directed: false, countTotalDirectedDegree: false },
  output: { contribution: 6 },
} satisfies ToolExample<Input, Output>;
export const vertexLoopDegreeContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/vertex-loop-degree-contribution",
    title: "Vertex Loop Degree Contribution Tool",
    description:
      "Return the loop incidence contribution under explicit undirected, single directed in/out, or total directed degree conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loopCount: { type: "integer", minimum: 0 },
        directed: { type: "boolean" },
        countTotalDirectedDegree: { type: "boolean" },
      },
      required: ["loopCount", "directed", "countTotalDirectedDegree"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "integer" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "loopCount",
          label: "Loop Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "directed",
          label: "Directed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "countTotalDirectedDegree",
          label: "Count Total Directed Degree",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = vertexLoopDegreeContributionTool.execute;
export default vertexLoopDegreeContributionTool;
