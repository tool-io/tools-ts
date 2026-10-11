import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chargeablePages: number;
  readonly suppliedPricePerPage: number;
  readonly fixedFee: number;
};
export type Output = { readonly totalFee: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chargeablePages: { type: "integer", minimum: 0 },
    suppliedPricePerPage: { type: "number", minimum: 0 },
    fixedFee: { type: "number", minimum: 0 },
  },
  required: ["chargeablePages", "suppliedPricePerPage", "fixedFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalFee: { type: "number" } },
  required: ["totalFee"],
} as const;
/** Apply an explicit per-page price and fixed fee to supplied chargeable pages without selecting public-record fee rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chargeablePages, suppliedPricePerPage, fixedFee } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(chargeablePages) &&
        chargeablePages >= 0 &&
        chargeablePages <= Number.MAX_SAFE_INTEGER,
      "chargeablePages",
    ),
      chargeablePages);
    H.domain(
      suppliedPricePerPage >= 0 && fixedFee >= 0,
      "suppliedPricePerPage",
    );
    return { totalFee: chargeablePages * suppliedPricePerPage + fixedFee };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { chargeablePages: 40, suppliedPricePerPage: 0.25, fixedFee: 2 },
  output: { totalFee: 12 },
} satisfies ToolExample<Input, Output>;
export const publicRecordFeePageCountProductTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/public-record-fee-page-count-product",
    title: "Public Record Fee Page Count Product",
    description:
      "Apply an explicit per-page price and fixed fee to supplied chargeable pages without selecting public-record fee rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chargeablePages: { type: "integer", minimum: 0 },
        suppliedPricePerPage: { type: "number", minimum: 0 },
        fixedFee: { type: "number", minimum: 0 },
      },
      required: ["chargeablePages", "suppliedPricePerPage", "fixedFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalFee: { type: "number" } },
      required: ["totalFee"],
    },
    ports: {
      inputs: [
        {
          id: "chargeablePages",
          label: "Chargeable Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedPricePerPage",
          label: "Supplied Price Per Page",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedFee",
          label: "Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalFee", label: "Total Fee", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = publicRecordFeePageCountProductTool.execute;
export default publicRecordFeePageCountProductTool;
