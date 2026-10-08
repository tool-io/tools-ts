import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly snapshotId: string;
  readonly scaleFactor: number;
};
export type Output = { readonly tag: string; readonly redshift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snapshotId: { type: "string", maxLength: 8192, minLength: 1 },
    scaleFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["snapshotId", "scaleFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tag: { type: "string", maxLength: 8192 },
    redshift: { type: "number" },
  },
  required: ["tag", "redshift"],
} as const;
/** Label an explicitly supplied simulation snapshot scale factor and corresponding cosmological redshift. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { snapshotId, scaleFactor } = request;
  const compute = (): Output => {
    H.domain(snapshotId.length > 0, "snapshotId");
    (H.domain(scaleFactor > 0, "scaleFactor"), scaleFactor);
    return {
      tag: snapshotId + " [a=" + scaleFactor + "]",
      redshift: 1 / scaleFactor - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { snapshotId: "S17", scaleFactor: 0.5 },
  output: { tag: "S17 [a=0.5]", redshift: 1 },
} satisfies ToolExample<Input, Output>;
export const cosmologicalSimulationSnapshotScaleTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cosmology", "physics"],
        keywords: ["cosmology", "physics"],
      },
      id: "cosmology/cosmological-simulation-snapshot-scale-tag",
      title: "Cosmological Simulation Snapshot Scale Tag",
      description:
        "Label an explicitly supplied simulation snapshot scale factor and corresponding cosmological redshift.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          snapshotId: { type: "string", maxLength: 8192, minLength: 1 },
          scaleFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["snapshotId", "scaleFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tag: { type: "string", maxLength: 8192 },
          redshift: { type: "number" },
        },
        required: ["tag", "redshift"],
      },
      ports: {
        inputs: [
          {
            id: "snapshotId",
            label: "Snapshot Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "scaleFactor",
            label: "Scale Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "tag", label: "Tag", valueType: { type: "string" } },
          { id: "redshift", label: "Redshift", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = cosmologicalSimulationSnapshotScaleTagTool.execute;
export default cosmologicalSimulationSnapshotScaleTagTool;
