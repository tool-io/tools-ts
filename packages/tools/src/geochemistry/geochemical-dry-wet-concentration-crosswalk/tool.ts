import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetConcentration: number;
  readonly waterMassFraction: number;
};
export type Output = {
  readonly dryConcentration: number;
  readonly solidsFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetConcentration: { type: "number" },
    waterMassFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["wetConcentration", "waterMassFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryConcentration: { type: "number" },
    solidsFraction: { type: "number" },
  },
  required: ["dryConcentration", "solidsFraction"],
} as const;
/** Calculate geochemical dry wet concentration crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetConcentration, waterMassFraction } = request;
  const compute = (): Output => {
    H.domain(waterMassFraction >= 0 && waterMassFraction < 1);
    return {
      dryConcentration: wetConcentration / (1 - waterMassFraction),
      solidsFraction: 1 - waterMassFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetConcentration: 8, waterMassFraction: 0.2 },
  output: { dryConcentration: 10, solidsFraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const geochemicalDryWetConcentrationCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/geochemical-dry-wet-concentration-crosswalk",
      title: "Geochemical Dry Wet Concentration Crosswalk Tool",
      description:
        "Calculate geochemical dry wet concentration crosswalk from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wetConcentration: { type: "number" },
          waterMassFraction: {
            type: "number",
            minimum: 0,
            exclusiveMaximum: 1,
          },
        },
        required: ["wetConcentration", "waterMassFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryConcentration: { type: "number" },
          solidsFraction: { type: "number" },
        },
        required: ["dryConcentration", "solidsFraction"],
      },
      ports: {
        inputs: [
          {
            id: "wetConcentration",
            label: "Wet Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waterMassFraction",
            label: "Water Mass Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "dryConcentration",
            label: "Dry Concentration",
            valueType: { type: "number" },
          },
          {
            id: "solidsFraction",
            label: "Solids Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = geochemicalDryWetConcentrationCrosswalkTool.execute;
export default geochemicalDryWetConcentrationCrosswalkTool;
