import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly loops: number };
export type Output = {
  readonly inDegree: number;
  readonly outDegree: number;
  readonly totalDegree: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loops: { type: "integer", minimum: 0 } },
  required: ["loops"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inDegree: { type: "integer" },
    outDegree: { type: "integer" },
    totalDegree: { type: "integer" },
  },
  required: ["inDegree", "outDegree", "totalDegree"],
} as const;
/** Calculate directed loop in out degree pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loops } = request;
  const compute = (): Output => {
    H.integer(loops, 0);
    return { inDegree: loops, outDegree: loops, totalDegree: 2 * loops };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { loops: 3 },
  output: { inDegree: 3, outDegree: 3, totalDegree: 6 },
} satisfies ToolExample<Input, Output>;
export const directedLoopInOutDegreePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/directed-loop-in-out-degree-pair",
    title: "Directed Loop In Out Degree Pair Tool",
    description:
      "Calculate directed loop in out degree pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loops: { type: "integer", minimum: 0 } },
      required: ["loops"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inDegree: { type: "integer" },
        outDegree: { type: "integer" },
        totalDegree: { type: "integer" },
      },
      required: ["inDegree", "outDegree", "totalDegree"],
    },
    ports: {
      inputs: [
        {
          id: "loops",
          label: "Loops",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "inDegree", label: "In Degree", valueType: { type: "integer" } },
        {
          id: "outDegree",
          label: "Out Degree",
          valueType: { type: "integer" },
        },
        {
          id: "totalDegree",
          label: "Total Degree",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = directedLoopInOutDegreePairTool.execute;
export default directedLoopInOutDegreePairTool;
