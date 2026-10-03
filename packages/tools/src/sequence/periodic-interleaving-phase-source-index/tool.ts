import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly globalIndex: number; readonly streams: number };
export type Output = { readonly stream: number; readonly sourceIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    globalIndex: { type: "integer", minimum: 0 },
    streams: { type: "integer", minimum: 1 },
  },
  required: ["globalIndex", "streams"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stream: { type: "integer" }, sourceIndex: { type: "integer" } },
  required: ["stream", "sourceIndex"],
} as const;
/** Calculate periodic interleaving phase source index from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { globalIndex, streams } = request;
  const compute = (): Output => {
    H.integer(globalIndex, 0);
    H.integer(streams, 1);
    return {
      stream: globalIndex % streams,
      sourceIndex: Math.floor(globalIndex / streams),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { globalIndex: 11, streams: 3 },
  output: { stream: 2, sourceIndex: 3 },
} satisfies ToolExample<Input, Output>;
export const periodicInterleavingPhaseSourceIndexTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sequence/periodic-interleaving-phase-source-index",
      title: "Periodic Interleaving Phase Source Index Tool",
      description:
        "Calculate periodic interleaving phase source index from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          globalIndex: { type: "integer", minimum: 0 },
          streams: { type: "integer", minimum: 1 },
        },
        required: ["globalIndex", "streams"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stream: { type: "integer" },
          sourceIndex: { type: "integer" },
        },
        required: ["stream", "sourceIndex"],
      },
      ports: {
        inputs: [
          {
            id: "globalIndex",
            label: "Global Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "streams",
            label: "Streams",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "stream", label: "Stream", valueType: { type: "integer" } },
          {
            id: "sourceIndex",
            label: "Source Index",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = periodicInterleavingPhaseSourceIndexTool.execute;
export default periodicInterleavingPhaseSourceIndexTool;
