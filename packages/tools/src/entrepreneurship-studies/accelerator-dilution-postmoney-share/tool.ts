import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly existingFounderFraction: number;
  readonly newInvestorPostMoneyFraction: number;
};
export type Output = {
  readonly founderPostMoneyFraction: number;
  readonly founderFractionReduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    existingFounderFraction: { type: "number", minimum: 0, maximum: 1 },
    newInvestorPostMoneyFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["existingFounderFraction", "newInvestorPostMoneyFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    founderPostMoneyFraction: { type: "number" },
    founderFractionReduction: { type: "number" },
  },
  required: ["founderPostMoneyFraction", "founderFractionReduction"],
} as const;
/** Apply a supplied post-money equity issuance fraction to an explicit existing founder fraction without modeling convertibles or option pools. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { existingFounderFraction, newInvestorPostMoneyFraction } = request;
  const compute = (): Output => {
    (H.domain(
      existingFounderFraction >= 0 && existingFounderFraction <= 1,
      "existingFounderFraction",
    ),
      existingFounderFraction);
    (H.domain(
      newInvestorPostMoneyFraction >= 0 && newInvestorPostMoneyFraction <= 1,
      "newInvestorPostMoneyFraction",
    ),
      newInvestorPostMoneyFraction);
    return {
      founderPostMoneyFraction:
        existingFounderFraction * (1 - newInvestorPostMoneyFraction),
      founderFractionReduction:
        existingFounderFraction * newInvestorPostMoneyFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { existingFounderFraction: 0.8, newInvestorPostMoneyFraction: 0.1 },
  output: {
    founderPostMoneyFraction: 0.7200000000000001,
    founderFractionReduction: 0.08000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const acceleratorDilutionPostmoneyShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/accelerator-dilution-postmoney-share",
    title: "Accelerator Dilution Postmoney Share Tool",
    description:
      "Apply a supplied post-money equity issuance fraction to an explicit existing founder fraction without modeling convertibles or option pools.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        existingFounderFraction: { type: "number", minimum: 0, maximum: 1 },
        newInvestorPostMoneyFraction: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
      },
      required: ["existingFounderFraction", "newInvestorPostMoneyFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        founderPostMoneyFraction: { type: "number" },
        founderFractionReduction: { type: "number" },
      },
      required: ["founderPostMoneyFraction", "founderFractionReduction"],
    },
    ports: {
      inputs: [
        {
          id: "existingFounderFraction",
          label: "Existing Founder Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newInvestorPostMoneyFraction",
          label: "New Investor Post Money Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "founderPostMoneyFraction",
          label: "Founder Post Money Fraction",
          valueType: { type: "number" },
        },
        {
          id: "founderFractionReduction",
          label: "Founder Fraction Reduction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = acceleratorDilutionPostmoneyShareTool.execute;
export default acceleratorDilutionPostmoneyShareTool;
