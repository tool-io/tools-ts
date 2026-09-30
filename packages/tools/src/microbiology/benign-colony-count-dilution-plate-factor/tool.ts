import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly colonies: number;
  readonly platedVolume: number;
  readonly dilutionFraction: number;
  readonly blankColonies: number;
};
export type Output = {
  readonly blankCorrected: number;
  readonly unitsPerVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    colonies: { type: "integer", minimum: 0 },
    platedVolume: { type: "number", exclusiveMinimum: 0 },
    dilutionFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    blankColonies: { type: "number", minimum: 0 },
  },
  required: ["colonies", "platedVolume", "dilutionFraction", "blankColonies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankCorrected: { type: "number" },
    unitsPerVolume: { type: "number" },
  },
  required: ["blankCorrected", "unitsPerVolume"],
} as const;
/** Observed benign-sample colony concentration from supplied counted volume and dilution, preserving signed blank correction without a growth protocol. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { colonies, platedVolume, dilutionFraction, blankColonies } = request;
  const compute = (): Output => {
    H.integer(colonies, 0);
    H.domain(
      blankColonies >= 0 && dilutionFraction > 0 && dilutionFraction <= 1,
    );
    H.positive(platedVolume);
    return {
      blankCorrected: colonies - blankColonies,
      unitsPerVolume:
        (colonies - blankColonies) / (platedVolume * dilutionFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    colonies: 50,
    platedVolume: 0.1,
    dilutionFraction: 0.01,
    blankColonies: 2,
  },
  output: { blankCorrected: 48, unitsPerVolume: 48000 },
} satisfies ToolExample<Input, Output>;
export const benignColonyCountDilutionPlateFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "microbiology/benign-colony-count-dilution-plate-factor",
      title: "Benign Colony Count Dilution Plate Factor Tool",
      description:
        "Observed benign-sample colony concentration from supplied counted volume and dilution, preserving signed blank correction without a growth protocol.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          colonies: { type: "integer", minimum: 0 },
          platedVolume: { type: "number", exclusiveMinimum: 0 },
          dilutionFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          blankColonies: { type: "number", minimum: 0 },
        },
        required: [
          "colonies",
          "platedVolume",
          "dilutionFraction",
          "blankColonies",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          blankCorrected: { type: "number" },
          unitsPerVolume: { type: "number" },
        },
        required: ["blankCorrected", "unitsPerVolume"],
      },
      ports: {
        inputs: [
          {
            id: "colonies",
            label: "Colonies",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "platedVolume",
            label: "Plated Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dilutionFraction",
            label: "Dilution Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blankColonies",
            label: "Blank Colonies",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "blankCorrected",
            label: "Blank Corrected",
            valueType: { type: "number" },
          },
          {
            id: "unitsPerVolume",
            label: "Units Per Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = benignColonyCountDilutionPlateFactorTool.execute;
export default benignColonyCountDilutionPlateFactorTool;
