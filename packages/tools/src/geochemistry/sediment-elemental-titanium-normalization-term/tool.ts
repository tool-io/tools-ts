import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elementConcentration: number;
  readonly titaniumConcentration: number;
  readonly referenceTitanium: number;
};
export type Output = {
  readonly elementTiRatio: number;
  readonly normalizedConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elementConcentration: { type: "number", minimum: 0 },
    titaniumConcentration: { type: "number", exclusiveMinimum: 0 },
    referenceTitanium: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "elementConcentration",
    "titaniumConcentration",
    "referenceTitanium",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elementTiRatio: { type: "number" },
    normalizedConcentration: { type: "number" },
  },
  required: ["elementTiRatio", "normalizedConcentration"],
} as const;
/** Calculate sediment elemental titanium normalization term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elementConcentration, titaniumConcentration, referenceTitanium } =
    request;
  const compute = (): Output => {
    H.domain(elementConcentration >= 0);
    H.positive(titaniumConcentration);
    H.positive(referenceTitanium);
    return {
      elementTiRatio: elementConcentration / titaniumConcentration,
      normalizedConcentration:
        (elementConcentration * referenceTitanium) / titaniumConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elementConcentration: 20,
    titaniumConcentration: 2,
    referenceTitanium: 3,
  },
  output: { elementTiRatio: 10, normalizedConcentration: 30 },
} satisfies ToolExample<Input, Output>;
export const sedimentElementalTitaniumNormalizationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/sediment-elemental-titanium-normalization-term",
      title: "Sediment Elemental Titanium Normalization Term Tool",
      description:
        "Calculate sediment elemental titanium normalization term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elementConcentration: { type: "number", minimum: 0 },
          titaniumConcentration: { type: "number", exclusiveMinimum: 0 },
          referenceTitanium: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "elementConcentration",
          "titaniumConcentration",
          "referenceTitanium",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elementTiRatio: { type: "number" },
          normalizedConcentration: { type: "number" },
        },
        required: ["elementTiRatio", "normalizedConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "elementConcentration",
            label: "Element Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "titaniumConcentration",
            label: "Titanium Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceTitanium",
            label: "Reference Titanium",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "elementTiRatio",
            label: "Element Ti Ratio",
            valueType: { type: "number" },
          },
          {
            id: "normalizedConcentration",
            label: "Normalized Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sedimentElementalTitaniumNormalizationTermTool.execute;
export default sedimentElementalTitaniumNormalizationTermTool;
