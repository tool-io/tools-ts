import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentVolume: number;
  readonly aliquotVolumes: readonly number[];
  readonly deadVolume: number;
};
export type Output = {
  readonly totalAliquots: number;
  readonly retainedParent: number;
  readonly aliquotShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentVolume: { type: "number", exclusiveMinimum: 0 },
    aliquotVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
    deadVolume: { type: "number", minimum: 0 },
  },
  required: ["parentVolume", "aliquotVolumes", "deadVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalAliquots: { type: "number" },
    retainedParent: { type: "number" },
    aliquotShare: { type: "number" },
  },
  required: ["totalAliquots", "retainedParent", "aliquotShare"],
} as const;
/** Calculate urinary lab aliquot parent share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentVolume, aliquotVolumes, deadVolume } = request;
  const compute = (): Output => {
    H.positive(parentVolume);
    H.domain(
      deadVolume >= 0 &&
        aliquotVolumes.every((x) => x >= 0) &&
        deadVolume + aliquotVolumes.reduce((a, b) => a + b, 0) <= parentVolume,
    );
    return {
      totalAliquots: aliquotVolumes.reduce((a, b) => a + b, 0),
      retainedParent:
        parentVolume - deadVolume - aliquotVolumes.reduce((a, b) => a + b, 0),
      aliquotShare: aliquotVolumes.reduce((a, b) => a + b, 0) / parentVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentVolume: 100, aliquotVolumes: [10, 20, 15], deadVolume: 5 },
  output: { totalAliquots: 45, retainedParent: 50, aliquotShare: 0.45 },
} satisfies ToolExample<Input, Output>;
export const urinaryLabAliquotParentShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/urinary-lab-aliquot-parent-share",
    title: "Urinary Lab Aliquot Parent Share Tool",
    description:
      "Calculate urinary lab aliquot parent share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentVolume: { type: "number", exclusiveMinimum: 0 },
        aliquotVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        deadVolume: { type: "number", minimum: 0 },
      },
      required: ["parentVolume", "aliquotVolumes", "deadVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalAliquots: { type: "number" },
        retainedParent: { type: "number" },
        aliquotShare: { type: "number" },
      },
      required: ["totalAliquots", "retainedParent", "aliquotShare"],
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
      ],
      outputs: [
        {
          id: "totalAliquots",
          label: "Total Aliquots",
          valueType: { type: "number" },
        },
        {
          id: "retainedParent",
          label: "Retained Parent",
          valueType: { type: "number" },
        },
        {
          id: "aliquotShare",
          label: "Aliquot Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = urinaryLabAliquotParentShareTool.execute;
export default urinaryLabAliquotParentShareTool;
