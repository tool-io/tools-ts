import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossDividend: number;
  readonly suppliedWithholdingFraction: number;
};
export type Output = {
  readonly withheldAmount: number;
  readonly netDividend: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossDividend: { type: "number", minimum: 0 },
    suppliedWithholdingFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossDividend", "suppliedWithholdingFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withheldAmount: { type: "number" },
    netDividend: { type: "number" },
  },
  required: ["withheldAmount", "netDividend"],
} as const;
/** Apply an explicitly supplied withholding fraction to one dividend without selecting tax rates or treaty treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossDividend, suppliedWithholdingFraction } = request;
  const compute = (): Output => {
    H.domain(grossDividend >= 0, "grossDividend");
    (H.domain(
      suppliedWithholdingFraction >= 0 && suppliedWithholdingFraction <= 1,
      "suppliedWithholdingFraction",
    ),
      suppliedWithholdingFraction);
    return {
      withheldAmount: grossDividend * suppliedWithholdingFraction,
      netDividend: grossDividend * (1 - suppliedWithholdingFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossDividend: 100, suppliedWithholdingFraction: 0.15 },
  output: { withheldAmount: 15, netDividend: 85 },
} satisfies ToolExample<Input, Output>;
export const dividendWithholdingSinglePaymentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["finance", "business and finance"],
      keywords: ["finance", "business and finance"],
    },
    id: "finance/dividend-withholding-single-payment",
    title: "Dividend Withholding Single Payment",
    description:
      "Apply an explicitly supplied withholding fraction to one dividend without selecting tax rates or treaty treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossDividend: { type: "number", minimum: 0 },
        suppliedWithholdingFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossDividend", "suppliedWithholdingFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withheldAmount: { type: "number" },
        netDividend: { type: "number" },
      },
      required: ["withheldAmount", "netDividend"],
    },
    ports: {
      inputs: [
        {
          id: "grossDividend",
          label: "Gross Dividend",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWithholdingFraction",
          label: "Supplied Withholding Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "withheldAmount",
          label: "Withheld Amount",
          valueType: { type: "number" },
        },
        {
          id: "netDividend",
          label: "Net Dividend",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dividendWithholdingSinglePaymentTool.execute;
export default dividendWithholdingSinglePaymentTool;
