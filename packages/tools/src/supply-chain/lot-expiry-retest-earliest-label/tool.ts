import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lotId: string;
  readonly expiryDate: string;
  readonly retestDate: string;
};
export type Output = { readonly earlierDate: string; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lotId: { type: "string", maxLength: 8192, minLength: 1 },
    expiryDate: { type: "string", maxLength: 8192 },
    retestDate: { type: "string", maxLength: 8192 },
  },
  required: ["lotId", "expiryDate", "retestDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earlierDate: { type: "string", maxLength: 8192 },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["earlierDate", "label"],
} as const;
/** Label the earlier explicit lot retest or expiry date without deciding material usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lotId, expiryDate, retestDate } = request;
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
    H.domain(lotId.length > 0, "lotId");
    return (() => {
      const earlierDate =
        namedDate(expiryDate, "expiryDate") <=
        namedDate(retestDate, "retestDate")
          ? expiryDate
          : retestDate;
      return { earlierDate, label: lotId + " [" + earlierDate + "]" };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lotId: "LOT17", expiryDate: "2026-12-01", retestDate: "2026-11-01" },
  output: { earlierDate: "2026-11-01", label: "LOT17 [2026-11-01]" },
} satisfies ToolExample<Input, Output>;
export const lotExpiryRetestEarliestLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["supply-chain", "supply chain", "business and finance"],
      keywords: ["supply chain", "business and finance"],
    },
    id: "supply-chain/lot-expiry-retest-earliest-label",
    title: "Lot Expiry Retest Earliest Label",
    description:
      "Label the earlier explicit lot retest or expiry date without deciding material usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lotId: { type: "string", maxLength: 8192, minLength: 1 },
        expiryDate: { type: "string", maxLength: 8192 },
        retestDate: { type: "string", maxLength: 8192 },
      },
      required: ["lotId", "expiryDate", "retestDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earlierDate: { type: "string", maxLength: 8192 },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["earlierDate", "label"],
    },
    ports: {
      inputs: [
        {
          id: "lotId",
          label: "Lot Id",
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
          id: "retestDate",
          label: "Retest Date",
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
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = lotExpiryRetestEarliestLabelTool.execute;
export default lotExpiryRetestEarliestLabelTool;
