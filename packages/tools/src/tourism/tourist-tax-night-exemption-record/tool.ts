import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalNights: number;
  readonly explicitlyExemptNights: number;
  readonly suppliedTaxPerNight: number;
};
export type Output = {
  readonly chargeableNights: number;
  readonly taxAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalNights: { type: "integer", minimum: 0 },
    explicitlyExemptNights: { type: "integer", minimum: 0 },
    suppliedTaxPerNight: { type: "number", minimum: 0 },
  },
  required: ["totalNights", "explicitlyExemptNights", "suppliedTaxPerNight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargeableNights: { type: "integer" },
    taxAmount: { type: "number" },
  },
  required: ["chargeableNights", "taxAmount"],
} as const;
/** Apply an explicit per-night tax to supplied nonexempt nights without determining exemptions or tax rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalNights, explicitlyExemptNights, suppliedTaxPerNight } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalNights) &&
        totalNights >= 0 &&
        totalNights <= Number.MAX_SAFE_INTEGER,
      "totalNights",
    ),
      totalNights);
    (H.domain(
      Number.isSafeInteger(explicitlyExemptNights) &&
        explicitlyExemptNights >= 0 &&
        explicitlyExemptNights <= totalNights,
      "explicitlyExemptNights",
    ),
      explicitlyExemptNights);
    H.domain(suppliedTaxPerNight >= 0, "suppliedTaxPerNight");
    return {
      chargeableNights: totalNights - explicitlyExemptNights,
      taxAmount: (totalNights - explicitlyExemptNights) * suppliedTaxPerNight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalNights: 5, explicitlyExemptNights: 2, suppliedTaxPerNight: 3 },
  output: { chargeableNights: 3, taxAmount: 9 },
} satisfies ToolExample<Input, Output>;
export const touristTaxNightExemptionRecordTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/tourist-tax-night-exemption-record",
    title: "Tourist Tax Night Exemption Record",
    description:
      "Apply an explicit per-night tax to supplied nonexempt nights without determining exemptions or tax rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalNights: { type: "integer", minimum: 0 },
        explicitlyExemptNights: { type: "integer", minimum: 0 },
        suppliedTaxPerNight: { type: "number", minimum: 0 },
      },
      required: [
        "totalNights",
        "explicitlyExemptNights",
        "suppliedTaxPerNight",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chargeableNights: { type: "integer" },
        taxAmount: { type: "number" },
      },
      required: ["chargeableNights", "taxAmount"],
    },
    ports: {
      inputs: [
        {
          id: "totalNights",
          label: "Total Nights",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "explicitlyExemptNights",
          label: "Explicitly Exempt Nights",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedTaxPerNight",
          label: "Supplied Tax Per Night",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "chargeableNights",
          label: "Chargeable Nights",
          valueType: { type: "integer" },
        },
        { id: "taxAmount", label: "Tax Amount", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = touristTaxNightExemptionRecordTool.execute;
export default touristTaxNightExemptionRecordTool;
