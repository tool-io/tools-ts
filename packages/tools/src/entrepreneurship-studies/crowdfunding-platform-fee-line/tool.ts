import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossRaised: number;
  readonly suppliedFeeFraction: number;
  readonly fixedFee: number;
};
export type Output = { readonly totalFee: number; readonly netRaised: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRaised: { type: "number", minimum: 0 },
    suppliedFeeFraction: { type: "number", minimum: 0, maximum: 1 },
    fixedFee: { type: "number", minimum: 0 },
  },
  required: ["grossRaised", "suppliedFeeFraction", "fixedFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalFee: { type: "number" }, netRaised: { type: "number" } },
  required: ["totalFee", "netRaised"],
} as const;
/** Apply explicit percentage and fixed crowdfunding fees to supplied gross proceeds without platform lookup or currency rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossRaised, suppliedFeeFraction, fixedFee } = request;
  const compute = (): Output => {
    H.domain(grossRaised >= 0, "grossRaised");
    (H.domain(
      suppliedFeeFraction >= 0 && suppliedFeeFraction <= 1,
      "suppliedFeeFraction",
    ),
      suppliedFeeFraction);
    H.domain(fixedFee >= 0, "fixedFee");
    return {
      totalFee: grossRaised * suppliedFeeFraction + fixedFee,
      netRaised: grossRaised * (1 - suppliedFeeFraction) - fixedFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossRaised: 1000, suppliedFeeFraction: 0.05, fixedFee: 10 },
  output: { totalFee: 60, netRaised: 940 },
} satisfies ToolExample<Input, Output>;
export const crowdfundingPlatformFeeLineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/crowdfunding-platform-fee-line",
    title: "Crowdfunding Platform Fee Line Tool",
    description:
      "Apply explicit percentage and fixed crowdfunding fees to supplied gross proceeds without platform lookup or currency rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRaised: { type: "number", minimum: 0 },
        suppliedFeeFraction: { type: "number", minimum: 0, maximum: 1 },
        fixedFee: { type: "number", minimum: 0 },
      },
      required: ["grossRaised", "suppliedFeeFraction", "fixedFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalFee: { type: "number" },
        netRaised: { type: "number" },
      },
      required: ["totalFee", "netRaised"],
    },
    ports: {
      inputs: [
        {
          id: "grossRaised",
          label: "Gross Raised",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFeeFraction",
          label: "Supplied Fee Fraction",
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
        { id: "netRaised", label: "Net Raised", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = crowdfundingPlatformFeeLineTool.execute;
export default crowdfundingPlatformFeeLineTool;
