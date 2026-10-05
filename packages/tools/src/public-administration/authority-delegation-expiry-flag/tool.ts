import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expiryDate: string;
  readonly asOfDate: string;
  readonly expiryDateInclusive: boolean;
};
export type Output = { readonly expired: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
    expiryDateInclusive: { type: "boolean" },
  },
  required: ["expiryDate", "asOfDate", "expiryDateInclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expired: { type: "boolean" } },
  required: ["expired"],
} as const;
/** Compare an explicit delegation expiry date and as-of date under a stated inclusive/exclusive end-date convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expiryDate, asOfDate, expiryDateInclusive } = request;
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
    const e = namedDate(expiryDate, "expiryDate").getTime(),
      t = namedDate(asOfDate, "asOfDate").getTime();
    return { expired: expiryDateInclusive ? t > e : t >= e };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    expiryDate: "2026-11-01",
    asOfDate: "2026-11-01",
    expiryDateInclusive: true,
  },
  output: { expired: false },
} satisfies ToolExample<Input, Output>;
export const authorityDelegationExpiryFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/authority-delegation-expiry-flag",
    title: "Authority Delegation Expiry Flag Tool",
    description:
      "Compare an explicit delegation expiry date and as-of date under a stated inclusive/exclusive end-date convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
        expiryDateInclusive: { type: "boolean" },
      },
      required: ["expiryDate", "asOfDate", "expiryDateInclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expired: { type: "boolean" } },
      required: ["expired"],
    },
    ports: {
      inputs: [
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
        {
          id: "expiryDateInclusive",
          label: "Expiry Date Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "expired", label: "Expired", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = authorityDelegationExpiryFlagTool.execute;
export default authorityDelegationExpiryFlagTool;
