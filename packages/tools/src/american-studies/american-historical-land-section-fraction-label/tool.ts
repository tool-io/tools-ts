import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
  readonly sectionNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "integer", minimum: 1 },
    denominator: { type: "integer", minimum: 1 },
    sectionNumber: { type: "integer", minimum: 1, maximum: 36 },
  },
  required: ["numerator", "denominator", "sectionNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied fractional section reference without locating a parcel or assigning its surveyed area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator, sectionNumber } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(denominator) &&
        denominator >= 1 &&
        denominator <= Number.MAX_SAFE_INTEGER,
      "denominator",
    ),
      denominator);
    (H.domain(
      Number.isSafeInteger(numerator) &&
        numerator >= 1 &&
        numerator <= denominator,
      "numerator",
    ),
      numerator);
    (H.domain(
      Number.isSafeInteger(sectionNumber) &&
        sectionNumber >= 1 &&
        sectionNumber <= 36,
      "sectionNumber",
    ),
      sectionNumber);
    return {
      label: numerator + "/" + denominator + " of section " + sectionNumber,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: 1, denominator: 4, sectionNumber: 12 },
  output: { label: "1/4 of section 12" },
} satisfies ToolExample<Input, Output>;
export const americanHistoricalLandSectionFractionLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "american-studies/american-historical-land-section-fraction-label",
      title: "American Historical Land Section Fraction Label Tool",
      description:
        "Label an explicitly supplied fractional section reference without locating a parcel or assigning its surveyed area.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numerator: { type: "integer", minimum: 1 },
          denominator: { type: "integer", minimum: 1 },
          sectionNumber: { type: "integer", minimum: 1, maximum: 36 },
        },
        required: ["numerator", "denominator", "sectionNumber"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "numerator",
            label: "Numerator",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "denominator",
            label: "Denominator",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "sectionNumber",
            label: "Section Number",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = americanHistoricalLandSectionFractionLabelTool.execute;
export default americanHistoricalLandSectionFractionLabelTool;
