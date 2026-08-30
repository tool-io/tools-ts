import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly verifiedFactualError: boolean;
  readonly imminentSafetyHarm: boolean;
  readonly privacyViolation: boolean;
  readonly strongPublicInterest: boolean;
  readonly canCorrectInPlace: boolean;
}>;
export type Output = Readonly<{
  readonly removalPressureScore: number;
  readonly retentionValueScore: number;
  readonly recommendedDecision: string;
}>;

export const calculate = (input: Input): Output => {
  const removalPressureScore =
    (input.verifiedFactualError ? 2 : 0) +
    (input.imminentSafetyHarm ? 4 : 0) +
    (input.privacyViolation ? 3 : 0);
  const retentionValueScore =
    (input.strongPublicInterest ? 3 : 0) + (input.canCorrectInPlace ? 2 : 0);
  const recommendedDecision = input.imminentSafetyHarm
    ? "remove"
    : input.privacyViolation && removalPressureScore > retentionValueScore
      ? "restrict"
      : input.verifiedFactualError && input.canCorrectInPlace
        ? "correct"
        : removalPressureScore > retentionValueScore
          ? "remove"
          : "retain";
  return { removalPressureScore, retentionValueScore, recommendedDecision };
};

export const exampleInput = {
  verifiedFactualError: true,
  imminentSafetyHarm: false,
  privacyViolation: false,
  strongPublicInterest: true,
  canCorrectInPlace: true,
} satisfies Input;
export const exampleOutput = {
  removalPressureScore: 2,
  retentionValueScore: 5,
  recommendedDecision: "correct",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      verifiedFactualError: input.verifiedFactualError as boolean,
      imminentSafetyHarm: input.imminentSafetyHarm as boolean,
      privacyViolation: input.privacyViolation as boolean,
      strongPublicInterest: input.strongPublicInterest as boolean,
      canCorrectInPlace: input.canCorrectInPlace as boolean,
    }),
  description:
    "Score supplied takedown factors and recommend an editorial action.",
  id: "journalism/takedown-decision-score",
  inputs: [
    {
      id: "verifiedFactualError",
      label: "Verified factual error",
      kind: "boolean",
    },
    {
      id: "imminentSafetyHarm",
      label: "Imminent safety harm",
      kind: "boolean",
    },
    { id: "privacyViolation", label: "Privacy violation", kind: "boolean" },
    {
      id: "strongPublicInterest",
      label: "Strong public interest",
      kind: "boolean",
    },
    { id: "canCorrectInPlace", label: "Can correct in place", kind: "boolean" },
  ],
  outputs: [
    {
      id: "removalPressureScore",
      label: "Removal pressure score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "retentionValueScore",
      label: "Retention value score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "recommendedDecision",
      label: "Recommended decision",
      kind: "string",
      enum: ["retain", "correct", "restrict", "remove"],
    },
  ],
  title: "Takedown Decision Score",
});

export const run = tool.execute;
export default tool;
