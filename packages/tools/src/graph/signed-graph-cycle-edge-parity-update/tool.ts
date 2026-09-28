import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly negativeEdges: number;
  readonly oldSign: number;
  readonly newSign: number;
};
export type Output = {
  readonly negativeEdges: number;
  readonly balanced: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negativeEdges: { type: "integer", minimum: 0 },
    oldSign: { type: "integer" },
    newSign: { type: "integer" },
  },
  required: ["negativeEdges", "oldSign", "newSign"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negativeEdges: { type: "integer" },
    balanced: { type: "boolean" },
  },
  required: ["negativeEdges", "balanced"],
} as const;
/** Calculate signed graph cycle edge parity update from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { negativeEdges, oldSign, newSign } = request;
  const compute = (): Output => {
    H.integer(negativeEdges, 0);
    H.domain(
      (oldSign === 1 || oldSign === -1) && (newSign === 1 || newSign === -1),
    );
    const n = negativeEdges - (oldSign < 0 ? 1 : 0) + (newSign < 0 ? 1 : 0);
    H.integer(n, 0);
    return { negativeEdges: n, balanced: n % 2 === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { negativeEdges: 2, oldSign: 1, newSign: -1 },
  output: { negativeEdges: 3, balanced: false },
} satisfies ToolExample<Input, Output>;
export const signedGraphCycleEdgeParityUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/signed-graph-cycle-edge-parity-update",
    title: "Signed Graph Cycle Edge Parity Update Tool",
    description:
      "Calculate signed graph cycle edge parity update from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        negativeEdges: { type: "integer", minimum: 0 },
        oldSign: { type: "integer" },
        newSign: { type: "integer" },
      },
      required: ["negativeEdges", "oldSign", "newSign"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        negativeEdges: { type: "integer" },
        balanced: { type: "boolean" },
      },
      required: ["negativeEdges", "balanced"],
    },
    ports: {
      inputs: [
        {
          id: "negativeEdges",
          label: "Negative Edges",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oldSign",
          label: "Old Sign",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newSign",
          label: "New Sign",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "negativeEdges",
          label: "Negative Edges",
          valueType: { type: "integer" },
        },
        { id: "balanced", label: "Balanced", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = signedGraphCycleEdgeParityUpdateTool.execute;
export default signedGraphCycleEdgeParityUpdateTool;
