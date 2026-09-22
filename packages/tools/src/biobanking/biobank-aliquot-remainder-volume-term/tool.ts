import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentVolume: number;
  readonly withdrawnVolumes: readonly number[];
  readonly deadVolume: number;
};
export type Output = { readonly remaining: number; readonly usable: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentVolume: { type: "number", minimum: 0 },
    withdrawnVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    deadVolume: { type: "number", minimum: 0 },
  },
  required: ["parentVolume", "withdrawnVolumes", "deadVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" }, usable: { type: "number" } },
  required: ["remaining", "usable"],
} as const;
/** Calculate biobank aliquot remainder volume term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentVolume, withdrawnVolumes, deadVolume } = request;
  const compute = (): Output => {
    H.domain(
      parentVolume >= 0 &&
        deadVolume >= 0 &&
        withdrawnVolumes.every((x) => x >= 0) &&
        withdrawnVolumes.reduce((a, b) => a + b, 0) <= parentVolume,
    );
    return {
      remaining: parentVolume - withdrawnVolumes.reduce((a, b) => a + b, 0),
      usable: Math.max(
        0,
        parentVolume - withdrawnVolumes.reduce((a, b) => a + b, 0) - deadVolume,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentVolume: 100, withdrawnVolumes: [20, 30], deadVolume: 5 },
  output: { remaining: 50, usable: 45 },
} satisfies ToolExample<Input, Output>;
export const biobankAliquotRemainderVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/biobank-aliquot-remainder-volume-term",
    title: "Biobank Aliquot Remainder Volume Term Tool",
    description:
      "Calculate biobank aliquot remainder volume term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentVolume: { type: "number", minimum: 0 },
        withdrawnVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        deadVolume: { type: "number", minimum: 0 },
      },
      required: ["parentVolume", "withdrawnVolumes", "deadVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remaining: { type: "number" }, usable: { type: "number" } },
      required: ["remaining", "usable"],
    },
    ports: {
      inputs: [
        {
          id: "parentVolume",
          label: "Parent Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withdrawnVolumes",
          label: "Withdrawn Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "deadVolume",
          label: "Dead Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        { id: "usable", label: "Usable", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biobankAliquotRemainderVolumeTermTool.execute;
export default biobankAliquotRemainderVolumeTermTool;
