import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentVolume: number;
  readonly aliquotVolumes: readonly number[];
  readonly deadVolume: number;
  readonly recordedRemainder: number;
};
export type Output = {
  readonly expectedRemainder: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentVolume: { type: "number", minimum: 0 },
    aliquotVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
    deadVolume: { type: "number", minimum: 0 },
    recordedRemainder: { type: "number", minimum: 0 },
  },
  required: [
    "parentVolume",
    "aliquotVolumes",
    "deadVolume",
    "recordedRemainder",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedRemainder: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedRemainder", "residual"],
} as const;
/** Supplied specimen-volume reconciliation without collection or processing recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentVolume, aliquotVolumes, deadVolume, recordedRemainder } =
    request;
  const compute = (): Output => {
    H.domain(
      parentVolume >= 0 &&
        deadVolume >= 0 &&
        recordedRemainder >= 0 &&
        aliquotVolumes.every((x) => x >= 0) &&
        aliquotVolumes.reduce((a, b) => a + b, 0) + deadVolume <= parentVolume,
    );
    return {
      expectedRemainder:
        parentVolume - aliquotVolumes.reduce((a, b) => a + b, 0) - deadVolume,
      residual:
        recordedRemainder -
        parentVolume +
        aliquotVolumes.reduce((a, b) => a + b, 0) +
        deadVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parentVolume: 10,
    aliquotVolumes: [2, 3],
    deadVolume: 1,
    recordedRemainder: 3,
  },
  output: { expectedRemainder: 4, residual: -1 },
} satisfies ToolExample<Input, Output>;
export const aliquotParentVolumeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/aliquot-parent-volume-residual",
    title: "Aliquot Parent Volume Residual Tool",
    description:
      "Supplied specimen-volume reconciliation without collection or processing recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentVolume: { type: "number", minimum: 0 },
        aliquotVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        deadVolume: { type: "number", minimum: 0 },
        recordedRemainder: { type: "number", minimum: 0 },
      },
      required: [
        "parentVolume",
        "aliquotVolumes",
        "deadVolume",
        "recordedRemainder",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedRemainder: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedRemainder", "residual"],
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
          id: "aliquotVolumes",
          label: "Aliquot Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "deadVolume",
          label: "Dead Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedRemainder",
          label: "Recorded Remainder",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedRemainder",
          label: "Expected Remainder",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = aliquotParentVolumeResidualTool.execute;
export default aliquotParentVolumeResidualTool;
