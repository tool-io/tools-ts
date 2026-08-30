import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly verificationDelayMinutes: number;
  readonly unverifiedAudienceReached: number;
  readonly audienceScale: number;
  readonly adversarialSource: boolean;
  readonly independentConfirmation: boolean;
}>;
export type Output = Readonly<{
  readonly amplificationRatio: number;
  readonly delayRiskScore: number;
  readonly riskLevel: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.audienceScale <= 0)
    simpleError(
      "audienceScale",
      "Audience scale must be positive.",
      "invalid_scale",
    );
  const amplificationRatio =
    input.unverifiedAudienceReached / input.audienceScale;
  const delayRiskScore =
    input.verificationDelayMinutes / 60 +
    amplificationRatio +
    (input.adversarialSource ? 2 : 0) -
    (input.independentConfirmation ? 1 : 0);
  return {
    amplificationRatio,
    delayRiskScore: Math.max(0, delayRiskScore),
    riskLevel:
      delayRiskScore >= 4 ? "high" : delayRiskScore >= 2 ? "elevated" : "low",
  };
};

export const exampleInput = {
  verificationDelayMinutes: 60,
  unverifiedAudienceReached: 1000,
  audienceScale: 1000,
  adversarialSource: true,
  independentConfirmation: false,
} satisfies Input;
export const exampleOutput = {
  amplificationRatio: 1,
  delayRiskScore: 4,
  riskLevel: "high",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      verificationDelayMinutes: input.verificationDelayMinutes as number,
      unverifiedAudienceReached: input.unverifiedAudienceReached as number,
      audienceScale: input.audienceScale as number,
      adversarialSource: input.adversarialSource as boolean,
      independentConfirmation: input.independentConfirmation as boolean,
    }),
  description:
    "Score verification delay and pre-verification amplification risk.",
  id: "journalism/propaganda-delay-score",
  inputs: [
    {
      id: "verificationDelayMinutes",
      label: "Verification delay",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "unverifiedAudienceReached",
      label: "Audience reached before verification",
      kind: "number",
      minimum: 0,
    },
    {
      id: "audienceScale",
      label: "Audience normalization scale",
      kind: "number",
      minimum: 0,
    },
    {
      id: "adversarialSource",
      label: "Source is adversarial",
      kind: "boolean",
    },
    {
      id: "independentConfirmation",
      label: "Independent confirmation obtained",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "amplificationRatio",
      label: "Pre-verification amplification ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "delayRiskScore",
      label: "Delay risk score",
      kind: "number",
      minimum: 0,
    },
    {
      id: "riskLevel",
      label: "Delay risk level",
      kind: "string",
      enum: ["low", "elevated", "high"],
    },
  ],
  title: "Propaganda Delay Score",
});

export const run = tool.execute;
export default tool;
