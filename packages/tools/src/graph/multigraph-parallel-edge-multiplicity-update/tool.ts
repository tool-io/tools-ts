import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly multiplicity: number; readonly delta: number };
export type Output = {
  readonly multiplicity: number;
  readonly removed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiplicity: { type: "integer", minimum: 0 },
    delta: { type: "integer" },
  },
  required: ["multiplicity", "delta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiplicity: { type: "integer" },
    removed: { type: "boolean" },
  },
  required: ["multiplicity", "removed"],
} as const;
/** Calculate multigraph parallel edge multiplicity update from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { multiplicity, delta } = request;
  const compute = (): Output => {
    H.integer(multiplicity, 0);
    const n = multiplicity + delta;
    H.integer(n, 0);
    return { multiplicity: n, removed: multiplicity > 0 && n === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { multiplicity: 3, delta: -3 },
  output: { multiplicity: 0, removed: true },
} satisfies ToolExample<Input, Output>;
export const multigraphParallelEdgeMultiplicityUpdateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "graph/multigraph-parallel-edge-multiplicity-update",
      title: "Multigraph Parallel Edge Multiplicity Update Tool",
      description:
        "Calculate multigraph parallel edge multiplicity update from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          multiplicity: { type: "integer", minimum: 0 },
          delta: { type: "integer" },
        },
        required: ["multiplicity", "delta"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          multiplicity: { type: "integer" },
          removed: { type: "boolean" },
        },
        required: ["multiplicity", "removed"],
      },
      ports: {
        inputs: [
          {
            id: "multiplicity",
            label: "Multiplicity",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "delta",
            label: "Delta",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "multiplicity",
            label: "Multiplicity",
            valueType: { type: "integer" },
          },
          { id: "removed", label: "Removed", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = multigraphParallelEdgeMultiplicityUpdateTool.execute;
export default multigraphParallelEdgeMultiplicityUpdateTool;
