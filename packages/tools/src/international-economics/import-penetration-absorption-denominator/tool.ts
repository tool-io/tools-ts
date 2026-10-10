import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly imports: number;
  readonly domesticProduction: number;
  readonly exports: number;
};
export type Output = {
  readonly domesticAbsorption: number;
  readonly importPenetrationFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    imports: { type: "number", minimum: 0 },
    domesticProduction: { type: "number", minimum: 0 },
    exports: { type: "number", minimum: 0 },
  },
  required: ["imports", "domesticProduction", "exports"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domesticAbsorption: { type: "number" },
    importPenetrationFraction: { type: "number" },
  },
  required: ["domesticAbsorption", "importPenetrationFraction"],
} as const;
/** Calculate supplied import penetration using explicit production-plus-imports-minus-exports absorption in compatible value or quantity units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { imports, domesticProduction, exports } = request;
  const compute = (): Output => {
    H.domain(imports >= 0, "imports");
    H.domain(domesticProduction >= 0, "domesticProduction");
    H.domain(exports >= 0, "exports");
    return (() => {
      const domesticAbsorption = domesticProduction + imports - exports;
      H.domain(
        domesticAbsorption > 0 && Number.isFinite(domesticAbsorption),
        "exports",
      );
      return {
        domesticAbsorption,
        importPenetrationFraction: imports / domesticAbsorption,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { imports: 20, domesticProduction: 100, exports: 40 },
  output: { domesticAbsorption: 80, importPenetrationFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const importPenetrationAbsorptionDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-economics/import-penetration-absorption-denominator",
      title: "Import Penetration Absorption Denominator Tool",
      description:
        "Calculate supplied import penetration using explicit production-plus-imports-minus-exports absorption in compatible value or quantity units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          imports: { type: "number", minimum: 0 },
          domesticProduction: { type: "number", minimum: 0 },
          exports: { type: "number", minimum: 0 },
        },
        required: ["imports", "domesticProduction", "exports"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          domesticAbsorption: { type: "number" },
          importPenetrationFraction: { type: "number" },
        },
        required: ["domesticAbsorption", "importPenetrationFraction"],
      },
      ports: {
        inputs: [
          {
            id: "imports",
            label: "Imports",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "domesticProduction",
            label: "Domestic Production",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exports",
            label: "Exports",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "domesticAbsorption",
            label: "Domestic Absorption",
            valueType: { type: "number" },
          },
          {
            id: "importPenetrationFraction",
            label: "Import Penetration Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = importPenetrationAbsorptionDenominatorTool.execute;
export default importPenetrationAbsorptionDenominatorTool;
