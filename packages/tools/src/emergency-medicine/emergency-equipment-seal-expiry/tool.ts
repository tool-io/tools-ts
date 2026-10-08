import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sealReference: string;
  readonly expiryDate: string;
  readonly asOfDate: string;
};
export type Output = { readonly label: string; readonly expired: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sealReference: { type: "string", maxLength: 8192, minLength: 1 },
    expiryDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["sealReference", "expiryDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    expired: { type: "boolean" },
  },
  required: ["label", "expired"],
} as const;
/** Label an explicit equipment-seal expiry record using an inclusive end date without certifying equipment readiness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sealReference, expiryDate, asOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(sealReference.length > 0, "sealReference");
    const expiry = namedDate(expiryDate, "expiryDate").getTime(),
      asOf = namedDate(asOfDate, "asOfDate").getTime();
    return {
      label: sealReference + " valid through " + expiryDate,
      expired: asOf > expiry,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sealReference: "SEAL17",
    expiryDate: "2026-12-01",
    asOfDate: "2026-11-01",
  },
  output: { label: "SEAL17 valid through 2026-12-01", expired: false },
} satisfies ToolExample<Input, Output>;
export const emergencyEquipmentSealExpiryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "emergency-medicine",
        "emergency medicine",
        "health and medicine",
      ],
      keywords: ["emergency medicine", "health and medicine"],
    },
    id: "emergency-medicine/emergency-equipment-seal-expiry",
    title: "Emergency Equipment Seal Expiry",
    description:
      "Label an explicit equipment-seal expiry record using an inclusive end date without certifying equipment readiness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sealReference: { type: "string", maxLength: 8192, minLength: 1 },
        expiryDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["sealReference", "expiryDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        expired: { type: "boolean" },
      },
      required: ["label", "expired"],
    },
    ports: {
      inputs: [
        {
          id: "sealReference",
          label: "Seal Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryDate",
          label: "Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "expired", label: "Expired", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = emergencyEquipmentSealExpiryTool.execute;
export default emergencyEquipmentSealExpiryTool;
