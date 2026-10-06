import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly wetBasisMoistureFraction: number;
};
export type Output = { readonly dryMass: number; readonly waterMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    wetBasisMoistureFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["wetMass", "wetBasisMoistureFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" }, waterMass: { type: "number" } },
  required: ["dryMass", "waterMass"],
} as const;
/** Partition explicit amendment wet mass into water and dry mass using supplied wet-basis moisture. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, wetBasisMoistureFraction } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0, "wetMass");
    (H.domain(
      wetBasisMoistureFraction >= 0 && wetBasisMoistureFraction <= 1,
      "wetBasisMoistureFraction",
    ),
      wetBasisMoistureFraction);
    return {
      dryMass: wetMass * (1 - wetBasisMoistureFraction),
      waterMass: wetMass * wetBasisMoistureFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, wetBasisMoistureFraction: 0.2 },
  output: { dryMass: 80, waterMass: 20 },
} satisfies ToolExample<Input, Output>;
export const soilAmendmentMassMoistureBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrochemistry", "agriculture"],
      keywords: ["agrochemistry", "agriculture"],
    },
    id: "agrochemistry/soil-amendment-mass-moisture-basis",
    title: "Soil Amendment Mass Moisture Basis",
    description:
      "Partition explicit amendment wet mass into water and dry mass using supplied wet-basis moisture.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        wetBasisMoistureFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["wetMass", "wetBasisMoistureFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        waterMass: { type: "number" },
      },
      required: ["dryMass", "waterMass"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetBasisMoistureFraction",
          label: "Wet Basis Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilAmendmentMassMoistureBasisTool.execute;
export default soilAmendmentMassMoistureBasisTool;
