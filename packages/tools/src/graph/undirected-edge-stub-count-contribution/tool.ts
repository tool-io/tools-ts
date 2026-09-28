import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly source: string;
  readonly target: string;
  readonly vertex: string;
};
export type Output = {
  readonly degreeContribution: number;
  readonly loop: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    source: { type: "string", maxLength: 8192 },
    target: { type: "string", maxLength: 8192 },
    vertex: { type: "string", maxLength: 8192 },
  },
  required: ["source", "target", "vertex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degreeContribution: { type: "integer" },
    loop: { type: "boolean" },
  },
  required: ["degreeContribution", "loop"],
} as const;
/** Calculate undirected edge stub count contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { source, target, vertex } = request;
  const compute = (): Output => {
    return {
      degreeContribution:
        (source === vertex ? 1 : 0) + (target === vertex ? 1 : 0),
      loop: source === target,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { source: "a", target: "a", vertex: "a" },
  output: { degreeContribution: 2, loop: true },
} satisfies ToolExample<Input, Output>;
export const undirectedEdgeStubCountContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graph/undirected-edge-stub-count-contribution",
      title: "Undirected Edge Stub Count Contribution Tool",
      description:
        "Calculate undirected edge stub count contribution from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          source: { type: "string", maxLength: 8192 },
          target: { type: "string", maxLength: 8192 },
          vertex: { type: "string", maxLength: 8192 },
        },
        required: ["source", "target", "vertex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          degreeContribution: { type: "integer" },
          loop: { type: "boolean" },
        },
        required: ["degreeContribution", "loop"],
      },
      ports: {
        inputs: [
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "target",
            label: "Target",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "vertex",
            label: "Vertex",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "degreeContribution",
            label: "Degree Contribution",
            valueType: { type: "integer" },
          },
          { id: "loop", label: "Loop", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = undirectedEdgeStubCountContributionTool.execute;
export default undirectedEdgeStubCountContributionTool;
