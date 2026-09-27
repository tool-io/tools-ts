import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredOxideAmount: number;
  readonly cationsPerOxide: number;
  readonly normalizationFactor: number;
};
export type Output = { readonly normalizedCations: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredOxideAmount: { type: "number", minimum: 0 },
    cationsPerOxide: { type: "number", minimum: 0 },
    normalizationFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredOxideAmount", "cationsPerOxide", "normalizationFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalizedCations: { type: "number" } },
  required: ["normalizedCations"],
} as const;
/** Apply explicit oxide-to-cation and normalization factors without a mineral formula table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredOxideAmount, cationsPerOxide, normalizationFactor } = request;
  const compute = (): Output => {
    H.domain(measuredOxideAmount >= 0 && cationsPerOxide >= 0);
    H.positive(normalizationFactor);
    return {
      normalizedCations:
        measuredOxideAmount * cationsPerOxide * normalizationFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredOxideAmount: 2,
    cationsPerOxide: 3,
    normalizationFactor: 0.5,
  },
  output: { normalizedCations: 3 },
} satisfies ToolExample<Input, Output>;
export const oxideStoichiometryNormalizationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/oxide-stoichiometry-normalization-term",
      title: "Oxide Stoichiometry Normalization Term Tool",
      description:
        "Apply explicit oxide-to-cation and normalization factors without a mineral formula table.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          measuredOxideAmount: { type: "number", minimum: 0 },
          cationsPerOxide: { type: "number", minimum: 0 },
          normalizationFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "measuredOxideAmount",
          "cationsPerOxide",
          "normalizationFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { normalizedCations: { type: "number" } },
        required: ["normalizedCations"],
      },
      ports: {
        inputs: [
          {
            id: "measuredOxideAmount",
            label: "Measured Oxide Amount",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cationsPerOxide",
            label: "Cations Per Oxide",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "normalizationFactor",
            label: "Normalization Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalizedCations",
            label: "Normalized Cations",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oxideStoichiometryNormalizationTermTool.execute;
export default oxideStoichiometryNormalizationTermTool;
