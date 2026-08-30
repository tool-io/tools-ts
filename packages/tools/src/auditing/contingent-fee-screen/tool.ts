import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly attestClient: boolean;
  readonly feeDependsOnOutcome: boolean;
  readonly feeDependsOnFinding: boolean;
  readonly fixedOrCourtSetFee: boolean;
}>;
export type Output = Readonly<{
  readonly prohibitionIndicatorCount: number;
  readonly potentiallyProhibited: boolean;
  readonly screenResult: string;
}>;

export const calculate = (input: Input): Output => {
  const prohibitionIndicatorCount = [
      input.attestClient,
      input.feeDependsOnOutcome,
      input.feeDependsOnFinding,
    ].filter(Boolean).length,
    potentiallyProhibited =
      input.attestClient &&
      (input.feeDependsOnOutcome || input.feeDependsOnFinding) &&
      !input.fixedOrCourtSetFee;
  return {
    prohibitionIndicatorCount,
    potentiallyProhibited,
    screenResult: potentiallyProhibited
      ? "prohibited-risk"
      : prohibitionIndicatorCount >= 2
        ? "review"
        : "clear",
  };
};

export const exampleInput = {
  attestClient: true,
  feeDependsOnOutcome: true,
  feeDependsOnFinding: false,
  fixedOrCourtSetFee: false,
} satisfies Input;
export const exampleOutput = {
  prohibitionIndicatorCount: 2,
  potentiallyProhibited: true,
  screenResult: "prohibited-risk",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      attestClient: input.attestClient as boolean,
      feeDependsOnOutcome: input.feeDependsOnOutcome as boolean,
      feeDependsOnFinding: input.feeDependsOnFinding as boolean,
      fixedOrCourtSetFee: input.fixedOrCourtSetFee as boolean,
    }),
  description:
    "Screen contingent-fee facts for attest-client prohibition risk.",
  id: "auditing/contingent-fee-screen",
  inputs: [
    {
      id: "attestClient",
      label: "Client receives attest services",
      kind: "boolean",
    },
    {
      id: "feeDependsOnOutcome",
      label: "Fee depends on outcome",
      kind: "boolean",
    },
    {
      id: "feeDependsOnFinding",
      label: "Fee depends on audit finding",
      kind: "boolean",
    },
    {
      id: "fixedOrCourtSetFee",
      label: "Fee is fixed or court-set",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "prohibitionIndicatorCount",
      label: "Prohibition indicators",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "potentiallyProhibited",
      label: "Potentially prohibited contingent fee",
      kind: "boolean",
    },
    {
      id: "screenResult",
      label: "Screen result",
      kind: "string",
      enum: ["clear", "review", "prohibited-risk"],
    },
  ],
  title: "Contingent-Fee Screen",
});

export const run = tool.execute;
export default tool;
