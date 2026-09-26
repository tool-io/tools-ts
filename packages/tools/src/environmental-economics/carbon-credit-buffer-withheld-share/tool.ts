import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly verifiedCredits: number;
  readonly bufferFraction: number;
  readonly pricePerCredit: number;
  readonly fees: number;
};
export type Output = {
  readonly bufferCredits: number;
  readonly saleableCredits: number;
  readonly netRevenue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verifiedCredits: { type: "number", minimum: 0 },
    bufferFraction: { type: "number", minimum: 0, maximum: 1 },
    pricePerCredit: { type: "number" },
    fees: { type: "number", minimum: 0 },
  },
  required: ["verifiedCredits", "bufferFraction", "pricePerCredit", "fees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bufferCredits: { type: "number" },
    saleableCredits: { type: "number" },
    netRevenue: { type: "number" },
  },
  required: ["bufferCredits", "saleableCredits", "netRevenue"],
} as const;
/** Calculate carbon credit buffer withheld share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { verifiedCredits, bufferFraction, pricePerCredit, fees } = request;
  const compute = (): Output => {
    H.domain(verifiedCredits >= 0 && fees >= 0);
    H.probability(bufferFraction);
    return {
      bufferCredits: verifiedCredits * bufferFraction,
      saleableCredits: verifiedCredits * (1 - bufferFraction),
      netRevenue:
        verifiedCredits * (1 - bufferFraction) * pricePerCredit - fees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    verifiedCredits: 1000,
    bufferFraction: 0.2,
    pricePerCredit: 15,
    fees: 500,
  },
  output: { bufferCredits: 200, saleableCredits: 800, netRevenue: 11500 },
} satisfies ToolExample<Input, Output>;
export const carbonCreditBufferWithheldShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/carbon-credit-buffer-withheld-share",
    title: "Carbon Credit Buffer Withheld Share Tool",
    description:
      "Calculate carbon credit buffer withheld share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verifiedCredits: { type: "number", minimum: 0 },
        bufferFraction: { type: "number", minimum: 0, maximum: 1 },
        pricePerCredit: { type: "number" },
        fees: { type: "number", minimum: 0 },
      },
      required: ["verifiedCredits", "bufferFraction", "pricePerCredit", "fees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bufferCredits: { type: "number" },
        saleableCredits: { type: "number" },
        netRevenue: { type: "number" },
      },
      required: ["bufferCredits", "saleableCredits", "netRevenue"],
    },
    ports: {
      inputs: [
        {
          id: "verifiedCredits",
          label: "Verified Credits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bufferFraction",
          label: "Buffer Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pricePerCredit",
          label: "Price Per Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fees",
          label: "Fees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bufferCredits",
          label: "Buffer Credits",
          valueType: { type: "number" },
        },
        {
          id: "saleableCredits",
          label: "Saleable Credits",
          valueType: { type: "number" },
        },
        {
          id: "netRevenue",
          label: "Net Revenue",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = carbonCreditBufferWithheldShareTool.execute;
export default carbonCreditBufferWithheldShareTool;
