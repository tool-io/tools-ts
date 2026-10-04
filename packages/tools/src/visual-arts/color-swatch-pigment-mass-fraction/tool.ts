import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pigmentMass: number;
  readonly binderMass: number;
  readonly solventMass: number;
};
export type Output = {
  readonly wetFraction: number;
  readonly dryFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pigmentMass: { type: "number", minimum: 0 },
    binderMass: { type: "number", minimum: 0 },
    solventMass: { type: "number", minimum: 0 },
  },
  required: ["pigmentMass", "binderMass", "solventMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetFraction: { type: "number" },
    dryFraction: { type: "number" },
  },
  required: ["wetFraction", "dryFraction"],
} as const;
/** Dry fraction assumes all solvent evaporates and all pigment and binder remain. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pigmentMass, binderMass, solventMass } = request;
  const compute = (): Output => {
    H.domain(
      pigmentMass >= 0 &&
        binderMass >= 0 &&
        solventMass >= 0 &&
        pigmentMass + binderMass > 0,
    );
    return {
      wetFraction: pigmentMass / (pigmentMass + binderMass + solventMass),
      dryFraction: pigmentMass / (pigmentMass + binderMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pigmentMass: 2, binderMass: 3, solventMass: 5 },
  output: { wetFraction: 0.2, dryFraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const colorSwatchPigmentMassFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/color-swatch-pigment-mass-fraction",
    title: "Color Swatch Pigment Mass Fraction Tool",
    description:
      "Dry fraction assumes all solvent evaporates and all pigment and binder remain.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pigmentMass: { type: "number", minimum: 0 },
        binderMass: { type: "number", minimum: 0 },
        solventMass: { type: "number", minimum: 0 },
      },
      required: ["pigmentMass", "binderMass", "solventMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetFraction: { type: "number" },
        dryFraction: { type: "number" },
      },
      required: ["wetFraction", "dryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "pigmentMass",
          label: "Pigment Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binderMass",
          label: "Binder Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solventMass",
          label: "Solvent Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wetFraction",
          label: "Wet Fraction",
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = colorSwatchPigmentMassFractionTool.execute;
export default colorSwatchPigmentMassFractionTool;
