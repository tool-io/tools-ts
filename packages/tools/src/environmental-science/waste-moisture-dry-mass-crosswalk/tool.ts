import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly wetBasisWaterFraction: number;
};
export type Output = { readonly dryMass: number; readonly waterMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    wetBasisWaterFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["wetMass", "wetBasisWaterFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" }, waterMass: { type: "number" } },
  required: ["dryMass", "waterMass"],
} as const;
/** Partition explicit waste wet mass into dry and water masses using a supplied wet-basis moisture fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, wetBasisWaterFraction } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0, "wetMass");
    (H.domain(
      wetBasisWaterFraction >= 0 && wetBasisWaterFraction <= 1,
      "wetBasisWaterFraction",
    ),
      wetBasisWaterFraction);
    return {
      dryMass: wetMass * (1 - wetBasisWaterFraction),
      waterMass: wetMass * wetBasisWaterFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, wetBasisWaterFraction: 0.25 },
  output: { dryMass: 75, waterMass: 25 },
} satisfies ToolExample<Input, Output>;
export const wasteMoistureDryMassCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "environmental-science",
        "environmental science",
        "earth and environmental sciences",
      ],
      keywords: ["environmental science", "earth and environmental sciences"],
    },
    id: "environmental-science/waste-moisture-dry-mass-crosswalk",
    title: "Waste Moisture Dry Mass Crosswalk",
    description:
      "Partition explicit waste wet mass into dry and water masses using a supplied wet-basis moisture fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        wetBasisWaterFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["wetMass", "wetBasisWaterFraction"],
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
          id: "wetBasisWaterFraction",
          label: "Wet Basis Water Fraction",
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
export const run = wasteMoistureDryMassCrosswalkTool.execute;
export default wasteMoistureDryMassCrosswalkTool;
