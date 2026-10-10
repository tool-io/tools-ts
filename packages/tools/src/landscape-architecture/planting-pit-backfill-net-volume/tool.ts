import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pitVolume: number;
  readonly rootballVolume: number;
  readonly suppliedDrainageVolume: number;
};
export type Output = { readonly backfillVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pitVolume: { type: "number", minimum: 0 },
    rootballVolume: { type: "number", minimum: 0 },
    suppliedDrainageVolume: { type: "number", minimum: 0 },
  },
  required: ["pitVolume", "rootballVolume", "suppliedDrainageVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { backfillVolume: { type: "number" } },
  required: ["backfillVolume"],
} as const;
/** Subtract explicit rootball and drainage occupied volumes from pit volume, preserving an over-occupation discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pitVolume, rootballVolume, suppliedDrainageVolume } = request;
  const compute = (): Output => {
    H.domain(
      pitVolume >= 0 && rootballVolume >= 0 && suppliedDrainageVolume >= 0,
      "pitVolume",
    );
    return {
      backfillVolume: pitVolume - rootballVolume - suppliedDrainageVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pitVolume: 1, rootballVolume: 0.3, suppliedDrainageVolume: 0.1 },
  output: { backfillVolume: 0.6 },
} satisfies ToolExample<Input, Output>;
export const plantingPitBackfillNetVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "landscape-architecture",
        "landscape architecture",
        "arts and design",
      ],
      keywords: ["landscape architecture", "arts and design"],
    },
    id: "landscape-architecture/planting-pit-backfill-net-volume",
    title: "Planting Pit Backfill Net Volume",
    description:
      "Subtract explicit rootball and drainage occupied volumes from pit volume, preserving an over-occupation discrepancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pitVolume: { type: "number", minimum: 0 },
        rootballVolume: { type: "number", minimum: 0 },
        suppliedDrainageVolume: { type: "number", minimum: 0 },
      },
      required: ["pitVolume", "rootballVolume", "suppliedDrainageVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { backfillVolume: { type: "number" } },
      required: ["backfillVolume"],
    },
    ports: {
      inputs: [
        {
          id: "pitVolume",
          label: "Pit Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rootballVolume",
          label: "Rootball Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDrainageVolume",
          label: "Supplied Drainage Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "backfillVolume",
          label: "Backfill Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = plantingPitBackfillNetVolumeTool.execute;
export default plantingPitBackfillNetVolumeTool;
