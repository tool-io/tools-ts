import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RubricRedInitialFlagInput = {
  readonly initialCount: number;
  readonly redInitialCount: number;
};

export type RubricRedInitialFlagOutput = {
  readonly redSharePercent: number;
  readonly rubricationPresent: boolean;
  readonly coverageBand: "none" | "sporadic" | "frequent" | "systematic";
};

export const calculateRubricRedInitialFlag = (
  input: RubricRedInitialFlagInput,
): RubricRedInitialFlagOutput => {
  if (!(Number.isInteger(input.initialCount) && input.initialCount >= 1))
    return simpleError(
      "initialCount",
      "Count the initials actually present (at least one).",
      "invalid_count",
    );
  if (
    !(Number.isInteger(input.redInitialCount) && input.redInitialCount >= 0) ||
    input.redInitialCount > input.initialCount
  )
    return simpleError(
      "redInitialCount",
      "Red initial count must be an integer between 0 and the total initial count.",
      "invalid_count",
    );
  const redSharePercent = (input.redInitialCount / input.initialCount) * 100;
  return {
    redSharePercent,
    rubricationPresent: input.redInitialCount >= 1,
    coverageBand:
      redSharePercent === 0
        ? "none"
        : redSharePercent < 10
          ? "sporadic"
          : redSharePercent <= 50
            ? "frequent"
            : "systematic",
  };
};

export const rubricRedInitialFlagExample = {
  input: { initialCount: 40, redInitialCount: 6 },
  output: {
    redSharePercent: 15,
    rubricationPresent: true,
    coverageBand: "frequent",
  },
} satisfies ToolExample<RubricRedInitialFlagInput, RubricRedInitialFlagOutput>;

export const rubricRedInitialFlagTool = createSimpleTool({
  id: "paleography/rubric-red-initial-flag",
  title: "Rubric Red Initial Flag",
  description:
    "Flag rubrication and band its coverage under the stated rule: red share of all initials in percent, with bands none (0%), sporadic (<10%), frequent (10-50%) and systematic (>50%).",
  inputs: [
    {
      description: "Total decorated or plain initials present.",
      id: "initialCount",
      kind: "integer",
      label: "Initials",
      minimum: 1,
    },
    {
      description: "Initials executed in red pigment or ink.",
      id: "redInitialCount",
      kind: "integer",
      label: "Red initials",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Red initials as a percentage of all initials.",
      id: "redSharePercent",
      kind: "number",
      label: "Red share %",
    },
    {
      description: "True when at least one red initial is recorded.",
      id: "rubricationPresent",
      kind: "boolean",
      label: "Rubrication present",
    },
    {
      description: "Coverage band from the stated thresholds.",
      id: "coverageBand",
      enum: ["none", "sporadic", "frequent", "systematic"],
      kind: "string",
      label: "Coverage band",
    },
  ],
  calculate: (input) =>
    calculateRubricRedInitialFlag({
      initialCount: input.initialCount as number,
      redInitialCount: input.redInitialCount as number,
    }),
});

export const runRubricRedInitialFlag = rubricRedInitialFlagTool.execute;
export default rubricRedInitialFlagTool;
