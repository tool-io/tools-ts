import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly containsPersonalAddress: boolean;
  readonly containsMinorIdentity: boolean;
  readonly containsMedicalDetail: boolean;
  readonly legalRetentionRequired: boolean;
  readonly publicInterestStrong: boolean;
}>;
export type Output = Readonly<{
  readonly sensitiveFactorCount: number;
  readonly recommendedAction: string;
  readonly triggeredFactors: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const entries = [
    ["personalAddress", input.containsPersonalAddress],
    ["minorIdentity", input.containsMinorIdentity],
    ["medicalDetail", input.containsMedicalDetail],
  ] as const;
  const triggeredFactors = entries.filter(([, on]) => on).map(([id]) => id),
    sensitiveFactorCount = triggeredFactors.length;
  const recommendedAction = input.legalRetentionRequired
    ? sensitiveFactorCount
      ? "restrict"
      : "retain"
    : input.publicInterestStrong
      ? sensitiveFactorCount
        ? "redact"
        : "retain"
      : sensitiveFactorCount >= 2
        ? "restrict"
        : sensitiveFactorCount === 1
          ? "redact"
          : "review";
  return { sensitiveFactorCount, recommendedAction, triggeredFactors };
};

export const exampleInput = {
  containsPersonalAddress: true,
  containsMinorIdentity: false,
  containsMedicalDetail: false,
  legalRetentionRequired: false,
  publicInterestStrong: true,
} satisfies Input;
export const exampleOutput = {
  sensitiveFactorCount: 1,
  recommendedAction: "redact",
  triggeredFactors: ["personalAddress"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      containsPersonalAddress: input.containsPersonalAddress as boolean,
      containsMinorIdentity: input.containsMinorIdentity as boolean,
      containsMedicalDetail: input.containsMedicalDetail as boolean,
      legalRetentionRequired: input.legalRetentionRequired as boolean,
      publicInterestStrong: input.publicInterestStrong as boolean,
    }),
  description: "Screen archived content for redaction or access restriction.",
  id: "journalism/archive-redaction-screen",
  inputs: [
    {
      id: "containsPersonalAddress",
      label: "Contains personal address",
      kind: "boolean",
    },
    {
      id: "containsMinorIdentity",
      label: "Contains minor identity",
      kind: "boolean",
    },
    {
      id: "containsMedicalDetail",
      label: "Contains medical detail",
      kind: "boolean",
    },
    {
      id: "legalRetentionRequired",
      label: "Legal retention required",
      kind: "boolean",
    },
    {
      id: "publicInterestStrong",
      label: "Strong public interest",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "sensitiveFactorCount",
      label: "Sensitive factor count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "recommendedAction",
      label: "Archive action",
      kind: "string",
      enum: ["retain", "redact", "restrict", "review"],
    },
    {
      id: "triggeredFactors",
      label: "Triggered sensitive factors",
      kind: "stringList",
    },
  ],
  title: "Archive Redaction Screen",
});

export const run = tool.execute;
export default tool;
