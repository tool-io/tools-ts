import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly milkMass: number;
  readonly fatFraction: number;
  readonly proteinFraction: number;
};
export type Output = { readonly fatMass: number; readonly proteinMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    milkMass: { type: "number", minimum: 0 },
    fatFraction: { type: "number", minimum: 0, maximum: 1 },
    proteinFraction: { type: "number", minimum: 0 },
  },
  required: ["milkMass", "fatFraction", "proteinFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fatMass: { type: "number" }, proteinMass: { type: "number" } },
  required: ["fatMass", "proteinMass"],
} as const;
/** Multiply supplied milk mass by explicit disjoint fat and protein mass fractions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { milkMass, fatFraction, proteinFraction } = request;
  const compute = (): Output => {
    H.domain(milkMass >= 0, "milkMass");
    (H.domain(fatFraction >= 0 && fatFraction <= 1, "fatFraction"),
      fatFraction);
    H.domain(
      proteinFraction >= 0 && proteinFraction <= 1 - fatFraction,
      "proteinFraction",
    );
    return {
      fatMass: milkMass * fatFraction,
      proteinMass: milkMass * proteinFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { milkMass: 100, fatFraction: 0.04, proteinFraction: 0.03 },
  output: { fatMass: 4, proteinMass: 3 },
} satisfies ToolExample<Input, Output>;
export const milkFatProteinOutputPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/milk-fat-protein-output-pair",
    title: "Milk Fat Protein Output Pair",
    description:
      "Multiply supplied milk mass by explicit disjoint fat and protein mass fractions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        milkMass: { type: "number", minimum: 0 },
        fatFraction: { type: "number", minimum: 0, maximum: 1 },
        proteinFraction: { type: "number", minimum: 0 },
      },
      required: ["milkMass", "fatFraction", "proteinFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fatMass: { type: "number" },
        proteinMass: { type: "number" },
      },
      required: ["fatMass", "proteinMass"],
    },
    ports: {
      inputs: [
        {
          id: "milkMass",
          label: "Milk Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fatFraction",
          label: "Fat Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proteinFraction",
          label: "Protein Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fatMass", label: "Fat Mass", valueType: { type: "number" } },
        {
          id: "proteinMass",
          label: "Protein Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = milkFatProteinOutputPairTool.execute;
export default milkFatProteinOutputPairTool;
