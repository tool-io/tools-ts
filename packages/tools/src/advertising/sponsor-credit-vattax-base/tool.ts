import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossSponsorAmount: number;
  readonly credit: number;
  readonly suppliedRate: number;
  readonly creditReducesBase: boolean;
};
export type Output = {
  readonly taxBase: number;
  readonly tax: number;
  readonly netBeforeTax: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossSponsorAmount: { type: "number", minimum: 0 },
    credit: { type: "number", minimum: 0 },
    suppliedRate: { type: "number", minimum: 0 },
    creditReducesBase: { type: "boolean" },
  },
  required: [
    "grossSponsorAmount",
    "credit",
    "suppliedRate",
    "creditReducesBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxBase: { type: "number" },
    tax: { type: "number" },
    netBeforeTax: { type: "number" },
  },
  required: ["taxBase", "tax", "netBeforeTax"],
} as const;
/** Calculate sponsor credit vattax base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossSponsorAmount, credit, suppliedRate, creditReducesBase } =
    request;
  const compute = (): Output => {
    H.domain(
      grossSponsorAmount >= 0 &&
        credit >= 0 &&
        credit <= grossSponsorAmount &&
        suppliedRate >= 0,
    );
    return {
      taxBase: grossSponsorAmount - (creditReducesBase ? credit : 0),
      tax:
        (grossSponsorAmount - (creditReducesBase ? credit : 0)) * suppliedRate,
      netBeforeTax: grossSponsorAmount - credit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossSponsorAmount: 100,
    credit: 20,
    suppliedRate: 0.2,
    creditReducesBase: true,
  },
  output: { taxBase: 80, tax: 16, netBeforeTax: 80 },
} satisfies ToolExample<Input, Output>;
export const sponsorCreditVattaxBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/sponsor-credit-vattax-base",
    title: "Sponsor Credit Vattax Base Tool",
    description:
      "Calculate sponsor credit vattax base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossSponsorAmount: { type: "number", minimum: 0 },
        credit: { type: "number", minimum: 0 },
        suppliedRate: { type: "number", minimum: 0 },
        creditReducesBase: { type: "boolean" },
      },
      required: [
        "grossSponsorAmount",
        "credit",
        "suppliedRate",
        "creditReducesBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxBase: { type: "number" },
        tax: { type: "number" },
        netBeforeTax: { type: "number" },
      },
      required: ["taxBase", "tax", "netBeforeTax"],
    },
    ports: {
      inputs: [
        {
          id: "grossSponsorAmount",
          label: "Gross Sponsor Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "credit",
          label: "Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRate",
          label: "Supplied Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditReducesBase",
          label: "Credit Reduces Base",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "taxBase", label: "Tax Base", valueType: { type: "number" } },
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        {
          id: "netBeforeTax",
          label: "Net Before Tax",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sponsorCreditVattaxBaseTool.execute;
export default sponsorCreditVattaxBaseTool;
