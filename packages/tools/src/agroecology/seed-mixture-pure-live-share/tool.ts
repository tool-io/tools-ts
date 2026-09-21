import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly massShare: number;
  readonly purity: number;
  readonly germination: number;
  readonly totalMixMass: number;
};
export type Output = {
  readonly pureLiveShare: number;
  readonly pureLiveMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massShare: { type: "number", minimum: 0, maximum: 1 },
    purity: { type: "number", minimum: 0, maximum: 1 },
    germination: { type: "number", minimum: 0, maximum: 1 },
    totalMixMass: { type: "number", minimum: 0 },
  },
  required: ["massShare", "purity", "germination", "totalMixMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pureLiveShare: { type: "number" },
    pureLiveMass: { type: "number" },
  },
  required: ["pureLiveShare", "pureLiveMass"],
} as const;
/** Calculate seed mixture pure live share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { massShare, purity, germination, totalMixMass } = request;
  const compute = (): Output => {
    H.probability(massShare);
    H.probability(purity);
    H.probability(germination);
    H.domain(totalMixMass >= 0);
    return {
      pureLiveShare: massShare * purity * germination,
      pureLiveMass: totalMixMass * massShare * purity * germination,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { massShare: 0.4, purity: 0.9, germination: 0.8, totalMixMass: 100 },
  output: { pureLiveShare: 0.28800000000000003, pureLiveMass: 28.8 },
} satisfies ToolExample<Input, Output>;
export const seedMixturePureLiveShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/seed-mixture-pure-live-share",
    title: "Seed Mixture Pure Live Share Tool",
    description:
      "Calculate seed mixture pure live share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massShare: { type: "number", minimum: 0, maximum: 1 },
        purity: { type: "number", minimum: 0, maximum: 1 },
        germination: { type: "number", minimum: 0, maximum: 1 },
        totalMixMass: { type: "number", minimum: 0 },
      },
      required: ["massShare", "purity", "germination", "totalMixMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pureLiveShare: { type: "number" },
        pureLiveMass: { type: "number" },
      },
      required: ["pureLiveShare", "pureLiveMass"],
    },
    ports: {
      inputs: [
        {
          id: "massShare",
          label: "Mass Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "purity",
          label: "Purity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "germination",
          label: "Germination",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalMixMass",
          label: "Total Mix Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pureLiveShare",
          label: "Pure Live Share",
          valueType: { type: "number" },
        },
        {
          id: "pureLiveMass",
          label: "Pure Live Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedMixturePureLiveShareTool.execute;
export default seedMixturePureLiveShareTool;
