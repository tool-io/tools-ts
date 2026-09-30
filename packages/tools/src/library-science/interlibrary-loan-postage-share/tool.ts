import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outbound: number;
  readonly inbound: number;
  readonly borrowerFraction: number;
  readonly handling: number;
};
export type Output = {
  readonly postage: number;
  readonly borrowerCharge: number;
  readonly libraryCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outbound: { type: "number", minimum: 0 },
    inbound: { type: "number", minimum: 0 },
    borrowerFraction: { type: "number", minimum: 0, maximum: 1 },
    handling: { type: "number", minimum: 0 },
  },
  required: ["outbound", "inbound", "borrowerFraction", "handling"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    postage: { type: "number" },
    borrowerCharge: { type: "number" },
    libraryCost: { type: "number" },
  },
  required: ["postage", "borrowerCharge", "libraryCost"],
} as const;
/** Calculate interlibrary loan postage share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outbound, inbound, borrowerFraction, handling } = request;
  const compute = (): Output => {
    H.domain(outbound >= 0 && inbound >= 0 && handling >= 0);
    H.probability(borrowerFraction);
    return {
      postage: outbound + inbound,
      borrowerCharge: (outbound + inbound) * borrowerFraction + handling,
      libraryCost: (outbound + inbound) * (1 - borrowerFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outbound: 5, inbound: 7, borrowerFraction: 0.5, handling: 2 },
  output: { postage: 12, borrowerCharge: 8, libraryCost: 6 },
} satisfies ToolExample<Input, Output>;
export const interlibraryLoanPostageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/interlibrary-loan-postage-share",
    title: "Interlibrary Loan Postage Share Tool",
    description:
      "Calculate interlibrary loan postage share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outbound: { type: "number", minimum: 0 },
        inbound: { type: "number", minimum: 0 },
        borrowerFraction: { type: "number", minimum: 0, maximum: 1 },
        handling: { type: "number", minimum: 0 },
      },
      required: ["outbound", "inbound", "borrowerFraction", "handling"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        postage: { type: "number" },
        borrowerCharge: { type: "number" },
        libraryCost: { type: "number" },
      },
      required: ["postage", "borrowerCharge", "libraryCost"],
    },
    ports: {
      inputs: [
        {
          id: "outbound",
          label: "Outbound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inbound",
          label: "Inbound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "borrowerFraction",
          label: "Borrower Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "handling",
          label: "Handling",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "postage", label: "Postage", valueType: { type: "number" } },
        {
          id: "borrowerCharge",
          label: "Borrower Charge",
          valueType: { type: "number" },
        },
        {
          id: "libraryCost",
          label: "Library Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = interlibraryLoanPostageShareTool.execute;
export default interlibraryLoanPostageShareTool;
