import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly wetMass: number;
  readonly waterDensity: number;
};
export type Output = {
  readonly waterMass: number;
  readonly dryBasisUptake: number;
  readonly waterVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", exclusiveMinimum: 0 },
    wetMass: { type: "number" },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dryMass", "wetMass", "waterDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number" },
    dryBasisUptake: { type: "number" },
    waterVolume: { type: "number" },
  },
  required: ["waterMass", "dryBasisUptake", "waterVolume"],
} as const;
/** Calculate biomaterial water uptake dry basis term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, wetMass, waterDensity } = request;
  const compute = (): Output => {
    H.positive(dryMass);
    H.domain(wetMass >= dryMass);
    H.positive(waterDensity);
    return {
      waterMass: wetMass - dryMass,
      dryBasisUptake: (wetMass - dryMass) / dryMass,
      waterVolume: (wetMass - dryMass) / waterDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMass: 10, wetMass: 18, waterDensity: 1 },
  output: { waterMass: 8, dryBasisUptake: 0.8, waterVolume: 8 },
} satisfies ToolExample<Input, Output>;
export const biomaterialWaterUptakeDryBasisTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/biomaterial-water-uptake-dry-basis-term",
    title: "Biomaterial Water Uptake Dry Basis Term Tool",
    description:
      "Calculate biomaterial water uptake dry basis term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number", exclusiveMinimum: 0 },
        wetMass: { type: "number" },
        waterDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dryMass", "wetMass", "waterDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number" },
        dryBasisUptake: { type: "number" },
        waterVolume: { type: "number" },
      },
      required: ["waterMass", "dryBasisUptake", "waterVolume"],
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
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterDensity",
          label: "Water Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
        {
          id: "dryBasisUptake",
          label: "Dry Basis Uptake",
          valueType: { type: "number" },
        },
        {
          id: "waterVolume",
          label: "Water Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biomaterialWaterUptakeDryBasisTermTool.execute;
export default biomaterialWaterUptakeDryBasisTermTool;
