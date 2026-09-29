import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly poreVolume: number;
  readonly liquidVolume: number;
  readonly retentionFraction: number;
  readonly meltInputVolume: number;
};
export type Output = {
  readonly capacity: number;
  readonly retainedVolume: number;
  readonly drainageVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poreVolume: { type: "number", minimum: 0 },
    liquidVolume: { type: "number", minimum: 0 },
    retentionFraction: { type: "number", minimum: 0, maximum: 1 },
    meltInputVolume: { type: "number", minimum: 0 },
  },
  required: [
    "poreVolume",
    "liquidVolume",
    "retentionFraction",
    "meltInputVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number" },
    retainedVolume: { type: "number" },
    drainageVolume: { type: "number" },
  },
  required: ["capacity", "retainedVolume", "drainageVolume"],
} as const;
/** Instantaneous liquid bucket with a supplied pore-volume retention fraction, not a snow permeability or percolation model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { poreVolume, liquidVolume, retentionFraction, meltInputVolume } =
    request;
  const compute = (): Output => {
    H.domain(poreVolume >= 0 && liquidVolume >= 0 && meltInputVolume >= 0);
    H.probability(retentionFraction);
    return {
      capacity: poreVolume * retentionFraction,
      retainedVolume: Math.min(
        poreVolume * retentionFraction,
        liquidVolume + meltInputVolume,
      ),
      drainageVolume: Math.max(
        0,
        liquidVolume + meltInputVolume - poreVolume * retentionFraction,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    poreVolume: 100,
    liquidVolume: 10,
    retentionFraction: 0.2,
    meltInputVolume: 15,
  },
  output: { capacity: 20, retainedVolume: 20, drainageVolume: 5 },
} satisfies ToolExample<Input, Output>;
export const snowpackLiquidWaterRetentionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/snowpack-liquid-water-retention-share",
    title: "Snowpack Liquid Water Retention Share Tool",
    description:
      "Instantaneous liquid bucket with a supplied pore-volume retention fraction, not a snow permeability or percolation model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poreVolume: { type: "number", minimum: 0 },
        liquidVolume: { type: "number", minimum: 0 },
        retentionFraction: { type: "number", minimum: 0, maximum: 1 },
        meltInputVolume: { type: "number", minimum: 0 },
      },
      required: [
        "poreVolume",
        "liquidVolume",
        "retentionFraction",
        "meltInputVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number" },
        retainedVolume: { type: "number" },
        drainageVolume: { type: "number" },
      },
      required: ["capacity", "retainedVolume", "drainageVolume"],
    },
    ports: {
      inputs: [
        {
          id: "poreVolume",
          label: "Pore Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "liquidVolume",
          label: "Liquid Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retentionFraction",
          label: "Retention Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meltInputVolume",
          label: "Melt Input Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "capacity", label: "Capacity", valueType: { type: "number" } },
        {
          id: "retainedVolume",
          label: "Retained Volume",
          valueType: { type: "number" },
        },
        {
          id: "drainageVolume",
          label: "Drainage Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = snowpackLiquidWaterRetentionShareTool.execute;
export default snowpackLiquidWaterRetentionShareTool;
