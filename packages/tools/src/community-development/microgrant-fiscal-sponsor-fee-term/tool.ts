import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grantAmount: number;
  readonly suppliedFeeFraction: number;
};
export type Output = {
  readonly sponsorFee: number;
  readonly amountAfterFee: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grantAmount: { type: "number", minimum: 0 },
    suppliedFeeFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grantAmount", "suppliedFeeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sponsorFee: { type: "number" },
    amountAfterFee: { type: "number" },
  },
  required: ["sponsorFee", "amountAfterFee"],
} as const;
/** Apply an explicit fiscal sponsor fee fraction to one microgrant without selecting grant or fee terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grantAmount, suppliedFeeFraction } = request;
  const compute = (): Output => {
    H.domain(grantAmount >= 0, "grantAmount");
    (H.domain(
      suppliedFeeFraction >= 0 && suppliedFeeFraction <= 1,
      "suppliedFeeFraction",
    ),
      suppliedFeeFraction);
    return {
      sponsorFee: grantAmount * suppliedFeeFraction,
      amountAfterFee: grantAmount * (1 - suppliedFeeFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grantAmount: 1000, suppliedFeeFraction: 0.05 },
  output: { sponsorFee: 50, amountAfterFee: 950 },
} satisfies ToolExample<Input, Output>;
export const micrograntFiscalSponsorFeeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/microgrant-fiscal-sponsor-fee-term",
    title: "Microgrant Fiscal Sponsor Fee Term",
    description:
      "Apply an explicit fiscal sponsor fee fraction to one microgrant without selecting grant or fee terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grantAmount: { type: "number", minimum: 0 },
        suppliedFeeFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grantAmount", "suppliedFeeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sponsorFee: { type: "number" },
        amountAfterFee: { type: "number" },
      },
      required: ["sponsorFee", "amountAfterFee"],
    },
    ports: {
      inputs: [
        {
          id: "grantAmount",
          label: "Grant Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFeeFraction",
          label: "Supplied Fee Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sponsorFee",
          label: "Sponsor Fee",
          valueType: { type: "number" },
        },
        {
          id: "amountAfterFee",
          label: "Amount After Fee",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = micrograntFiscalSponsorFeeTermTool.execute;
export default micrograntFiscalSponsorFeeTermTool;
