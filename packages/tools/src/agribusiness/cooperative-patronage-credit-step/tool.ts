import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligiblePurchases: number;
  readonly suppliedCreditFraction: number;
};
export type Output = { readonly patronageCredit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligiblePurchases: { type: "number", minimum: 0 },
    suppliedCreditFraction: { type: "number", minimum: 0 },
  },
  required: ["eligiblePurchases", "suppliedCreditFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { patronageCredit: { type: "number" } },
  required: ["patronageCredit"],
} as const;
/** Multiply supplied eligible purchases by an explicit patronage-credit rate without determining cooperative policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligiblePurchases, suppliedCreditFraction } = request;
  const compute = (): Output => {
    H.domain(eligiblePurchases >= 0, "eligiblePurchases");
    H.domain(suppliedCreditFraction >= 0, "suppliedCreditFraction");
    return { patronageCredit: eligiblePurchases * suppliedCreditFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligiblePurchases: 1000, suppliedCreditFraction: 0.04 },
  output: { patronageCredit: 40 },
} satisfies ToolExample<Input, Output>;
export const cooperativePatronageCreditStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/cooperative-patronage-credit-step",
    title: "Cooperative Patronage Credit Step",
    description:
      "Multiply supplied eligible purchases by an explicit patronage-credit rate without determining cooperative policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligiblePurchases: { type: "number", minimum: 0 },
        suppliedCreditFraction: { type: "number", minimum: 0 },
      },
      required: ["eligiblePurchases", "suppliedCreditFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { patronageCredit: { type: "number" } },
      required: ["patronageCredit"],
    },
    ports: {
      inputs: [
        {
          id: "eligiblePurchases",
          label: "Eligible Purchases",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCreditFraction",
          label: "Supplied Credit Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "patronageCredit",
          label: "Patronage Credit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cooperativePatronageCreditStepTool.execute;
export default cooperativePatronageCreditStepTool;
