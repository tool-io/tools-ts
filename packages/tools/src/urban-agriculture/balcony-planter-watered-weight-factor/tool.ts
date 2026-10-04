import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly retainedWaterVolume: number;
  readonly waterDensity: number;
  readonly drainedWaterMass: number;
};
export type Output = { readonly wateredMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", minimum: 0 },
    retainedWaterVolume: { type: "number", minimum: 0 },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
    drainedWaterMass: { type: "number", minimum: 0 },
  },
  required: [
    "dryMass",
    "retainedWaterVolume",
    "waterDensity",
    "drainedWaterMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wateredMass: { type: "number" } },
  required: ["wateredMass"],
} as const;
/** Calculate balcony planter watered weight factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, retainedWaterVolume, waterDensity, drainedWaterMass } =
    request;
  const compute = (): Output => {
    H.domain(
      dryMass >= 0 &&
        retainedWaterVolume >= 0 &&
        drainedWaterMass >= 0 &&
        drainedWaterMass <= retainedWaterVolume * waterDensity,
    );
    H.positive(waterDensity);
    return {
      wateredMass:
        dryMass + retainedWaterVolume * waterDensity - drainedWaterMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dryMass: 20,
    retainedWaterVolume: 5,
    waterDensity: 1,
    drainedWaterMass: 1,
  },
  output: { wateredMass: 24 },
} satisfies ToolExample<Input, Output>;
export const balconyPlanterWateredWeightFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/balcony-planter-watered-weight-factor",
    title: "Balcony Planter Watered Weight Factor Tool",
    description:
      "Calculate balcony planter watered weight factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number", minimum: 0 },
        retainedWaterVolume: { type: "number", minimum: 0 },
        waterDensity: { type: "number", exclusiveMinimum: 0 },
        drainedWaterMass: { type: "number", minimum: 0 },
      },
      required: [
        "dryMass",
        "retainedWaterVolume",
        "waterDensity",
        "drainedWaterMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wateredMass: { type: "number" } },
      required: ["wateredMass"],
    },
    ports: {
      inputs: [
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainedWaterVolume",
          label: "Retained Water Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDensity",
          label: "Water Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "drainedWaterMass",
          label: "Drained Water Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wateredMass",
          label: "Watered Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = balconyPlanterWateredWeightFactorTool.execute;
export default balconyPlanterWateredWeightFactorTool;
