import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retestDate: string;
  readonly expiryDate: string;
};
export type Output = {
  readonly earlierDate: string;
  readonly sameDate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retestDate: { type: "string", maxLength: 8192 },
    expiryDate: { type: "string", maxLength: 8192 },
  },
  required: ["retestDate", "expiryDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earlierDate: { type: "string", maxLength: 8192 },
    sameDate: { type: "boolean" },
  },
  required: ["earlierDate", "sameDate"],
} as const;
/** Return the earlier of explicit retest and expiry dates without deciding material suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retestDate, expiryDate } = request;
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
    return {
      earlierDate:
        namedDate(retestDate, "retestDate") <=
        namedDate(expiryDate, "expiryDate")
          ? retestDate
          : expiryDate,
      sameDate: retestDate === expiryDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retestDate: "2026-11-01", expiryDate: "2026-12-01" },
  output: { earlierDate: "2026-11-01", sameDate: false },
} satisfies ToolExample<Input, Output>;
export const pharmaceuticalRetestExpiryEarlierdateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["industrial-pharmacy", "industrial pharmacy", "pharmacy"],
        keywords: ["industrial pharmacy", "pharmacy"],
      },
      id: "industrial-pharmacy/pharmaceutical-retest-expiry-earlier-date",
      title: "Pharmaceutical Retest Expiry Earlier Date",
      description:
        "Return the earlier of explicit retest and expiry dates without deciding material suitability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retestDate: { type: "string", maxLength: 8192 },
          expiryDate: { type: "string", maxLength: 8192 },
        },
        required: ["retestDate", "expiryDate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          earlierDate: { type: "string", maxLength: 8192 },
          sameDate: { type: "boolean" },
        },
        required: ["earlierDate", "sameDate"],
      },
      ports: {
        inputs: [
          {
            id: "retestDate",
            label: "Retest Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expiryDate",
            label: "Expiry Date",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "earlierDate",
            label: "Earlier Date",
            valueType: { type: "string" },
          },
          {
            id: "sameDate",
            label: "Same Date",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmaceuticalRetestExpiryEarlierdateTool.execute;
export default pharmaceuticalRetestExpiryEarlierdateTool;
