import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
};
export type Output = {
  readonly decimalAcuity: number;
  readonly logMar: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "number", exclusiveMinimum: 0 },
    denominator: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["numerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { decimalAcuity: { type: "number" }, logMar: { type: "number" } },
  required: ["decimalAcuity", "logMar"],
} as const;
/** Numerical Snellen fraction, decimal and logMAR crosswalk, excluding counting-fingers or other non-Snellen categories and clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator } = request;
  const compute = (): Output => {
    H.positive(numerator);
    H.positive(denominator);
    return {
      decimalAcuity: numerator / denominator,
      logMar: Math.log10(denominator / numerator),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: 20, denominator: 40 },
  output: { decimalAcuity: 0.5, logMar: 0.3010299956639812 },
} satisfies ToolExample<Input, Output>;
export const snellenDecimalLogmarSourceCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ophthalmology/snellen-decimal-logmar-source-crosswalk",
      title: "Snellen Decimal Logmar Source Crosswalk Tool",
      description:
        "Numerical Snellen fraction, decimal and logMAR crosswalk, excluding counting-fingers or other non-Snellen categories and clinical interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: { type: "number", exclusiveMinimum: 0 },
          denominator: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["numerator", "denominator"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          decimalAcuity: { type: "number" },
          logMar: { type: "number" },
        },
        required: ["decimalAcuity", "logMar"],
      },
      ports: {
        inputs: [
          {
            id: "numerator",
            label: "Numerator",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "denominator",
            label: "Denominator",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "decimalAcuity",
            label: "Decimal Acuity",
            valueType: { type: "number" },
          },
          { id: "logMar", label: "Log Mar", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = snellenDecimalLogmarSourceCrosswalkTool.execute;
export default snellenDecimalLogmarSourceCrosswalkTool;
