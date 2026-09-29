import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stages: number; readonly centesimal: boolean };
export type Output = {
  readonly decimalStages: number;
  readonly centesimalEquivalent: number;
  readonly log10Fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stages: { type: "integer", minimum: 0 },
    centesimal: { type: "boolean" },
  },
  required: ["stages", "centesimal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decimalStages: { type: "integer" },
    centesimalEquivalent: { type: "number" },
    log10Fraction: { type: "number" },
  },
  required: ["decimalStages", "centesimalEquivalent", "log10Fraction"],
} as const;
/** Calculate homeopathy centesimal decimal stage crosswalk from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stages, centesimal } = request;
  const compute = (): Output => {
    H.integer(stages, 0);
    return {
      decimalStages: centesimal ? 2 * stages : stages,
      centesimalEquivalent: centesimal ? stages : stages / 2,
      log10Fraction: centesimal ? -2 * stages : -stages,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stages: 6, centesimal: true },
  output: { decimalStages: 12, centesimalEquivalent: 6, log10Fraction: -12 },
} satisfies ToolExample<Input, Output>;
export const homeopathyCentesimalDecimalStageCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "homeopathy/homeopathy-centesimal-decimal-stage-crosswalk",
      title: "Homeopathy Centesimal Decimal Stage Crosswalk Tool",
      description:
        "Calculate homeopathy centesimal decimal stage crosswalk from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stages: { type: "integer", minimum: 0 },
          centesimal: { type: "boolean" },
        },
        required: ["stages", "centesimal"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          decimalStages: { type: "integer" },
          centesimalEquivalent: { type: "number" },
          log10Fraction: { type: "number" },
        },
        required: ["decimalStages", "centesimalEquivalent", "log10Fraction"],
      },
      ports: {
        inputs: [
          {
            id: "stages",
            label: "Stages",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "centesimal",
            label: "Centesimal",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "decimalStages",
            label: "Decimal Stages",
            valueType: { type: "integer" },
          },
          {
            id: "centesimalEquivalent",
            label: "Centesimal Equivalent",
            valueType: { type: "number" },
          },
          {
            id: "log10Fraction",
            label: "Log10Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = homeopathyCentesimalDecimalStageCrosswalkTool.execute;
export default homeopathyCentesimalDecimalStageCrosswalkTool;
