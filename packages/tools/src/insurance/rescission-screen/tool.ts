import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly applicationStatementFalse: boolean;
  readonly statementMaterial: boolean;
  readonly intentToDeceive: boolean;
  readonly withinContestabilityPeriod: boolean;
  readonly claimRelatedToStatement: boolean;
}>;
export type Output = Readonly<{
  readonly rescissionFactorCount: number;
  readonly screenResult: string;
  readonly manualLegalReview: boolean;
}>;

export const calculate = (input: Input): Output => {
  const rescissionFactorCount = [
    input.applicationStatementFalse,
    input.statementMaterial,
    input.intentToDeceive,
    input.withinContestabilityPeriod,
    input.claimRelatedToStatement,
  ].filter(Boolean).length;
  return {
    rescissionFactorCount,
    screenResult:
      rescissionFactorCount >= 4
        ? "high-risk"
        : rescissionFactorCount >= 2
          ? "review"
          : "low-risk",
    manualLegalReview:
      input.applicationStatementFalse && input.statementMaterial,
  };
};

export const exampleInput = {
  applicationStatementFalse: true,
  statementMaterial: true,
  intentToDeceive: false,
  withinContestabilityPeriod: true,
  claimRelatedToStatement: true,
} satisfies Input;
export const exampleOutput = {
  rescissionFactorCount: 4,
  screenResult: "high-risk",
  manualLegalReview: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      applicationStatementFalse: input.applicationStatementFalse as boolean,
      statementMaterial: input.statementMaterial as boolean,
      intentToDeceive: input.intentToDeceive as boolean,
      withinContestabilityPeriod: input.withinContestabilityPeriod as boolean,
      claimRelatedToStatement: input.claimRelatedToStatement as boolean,
    }),
  description:
    "Screen supplied application and claim facts for rescission review.",
  id: "insurance/rescission-screen",
  inputs: [
    {
      id: "applicationStatementFalse",
      label: "Application statement was false",
      kind: "boolean",
    },
    {
      id: "statementMaterial",
      label: "Statement was material",
      kind: "boolean",
    },
    {
      id: "intentToDeceive",
      label: "Intent to deceive indicated",
      kind: "boolean",
    },
    {
      id: "withinContestabilityPeriod",
      label: "Within contestability period",
      kind: "boolean",
    },
    {
      id: "claimRelatedToStatement",
      label: "Claim relates to statement",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "rescissionFactorCount",
      label: "Rescission factor count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "screenResult",
      label: "Rescission screen result",
      kind: "string",
      enum: ["low-risk", "review", "high-risk"],
    },
    {
      id: "manualLegalReview",
      label: "Manual legal review recommended",
      kind: "boolean",
    },
  ],
  title: "Rescission Screen",
});

export const run = tool.execute;
export default tool;
