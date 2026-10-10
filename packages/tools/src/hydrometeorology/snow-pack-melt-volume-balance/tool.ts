import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingWaterVolume: number;
  readonly snowfallWaterAdded: number;
  readonly meltWaterRemoved: number;
  readonly sublimationWaterRemoved: number;
};
export type Output = { readonly remainingWaterVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingWaterVolume: { type: "number", minimum: 0 },
    snowfallWaterAdded: { type: "number", minimum: 0 },
    meltWaterRemoved: { type: "number", minimum: 0 },
    sublimationWaterRemoved: { type: "number", minimum: 0 },
  },
  required: [
    "openingWaterVolume",
    "snowfallWaterAdded",
    "meltWaterRemoved",
    "sublimationWaterRemoved",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingWaterVolume: { type: "number" } },
  required: ["remainingWaterVolume"],
} as const;
/** Reconcile explicitly supplied snowpack water-equivalent movements, retaining signed discrepancies without a melt model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingWaterVolume,
    snowfallWaterAdded,
    meltWaterRemoved,
    sublimationWaterRemoved,
  } = request;
  const compute = (): Output => {
    H.domain(
      openingWaterVolume >= 0 &&
        snowfallWaterAdded >= 0 &&
        meltWaterRemoved >= 0 &&
        sublimationWaterRemoved >= 0,
      "openingWaterVolume",
    );
    return {
      remainingWaterVolume:
        openingWaterVolume +
        snowfallWaterAdded -
        meltWaterRemoved -
        sublimationWaterRemoved,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingWaterVolume: 100,
    snowfallWaterAdded: 20,
    meltWaterRemoved: 30,
    sublimationWaterRemoved: 5,
  },
  output: { remainingWaterVolume: 85 },
} satisfies ToolExample<Input, Output>;
export const snowPackMeltVolumeBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrometeorology", "earth and environmental sciences"],
      keywords: ["hydrometeorology", "earth and environmental sciences"],
    },
    id: "hydrometeorology/snow-pack-melt-volume-balance",
    title: "Snow Pack Melt Volume Balance",
    description:
      "Reconcile explicitly supplied snowpack water-equivalent movements, retaining signed discrepancies without a melt model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingWaterVolume: { type: "number", minimum: 0 },
        snowfallWaterAdded: { type: "number", minimum: 0 },
        meltWaterRemoved: { type: "number", minimum: 0 },
        sublimationWaterRemoved: { type: "number", minimum: 0 },
      },
      required: [
        "openingWaterVolume",
        "snowfallWaterAdded",
        "meltWaterRemoved",
        "sublimationWaterRemoved",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingWaterVolume: { type: "number" } },
      required: ["remainingWaterVolume"],
    },
    ports: {
      inputs: [
        {
          id: "openingWaterVolume",
          label: "Opening Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "snowfallWaterAdded",
          label: "Snowfall Water Added",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meltWaterRemoved",
          label: "Melt Water Removed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sublimationWaterRemoved",
          label: "Sublimation Water Removed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingWaterVolume",
          label: "Remaining Water Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = snowPackMeltVolumeBalanceTool.execute;
export default snowPackMeltVolumeBalanceTool;
