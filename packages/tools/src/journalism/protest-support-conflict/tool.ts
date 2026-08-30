import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly financialSupport: boolean;
  readonly organizationalRole: boolean;
  readonly publicAdvocacy: boolean;
  readonly assignmentOverlapsSupport: boolean;
}>;
export type Output = Readonly<{
  readonly conflictIndicatorCount: number;
  readonly conflictLevel: string;
  readonly triggeredIndicators: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const entries = [
    ["financialSupport", input.financialSupport],
    ["organizationalRole", input.organizationalRole],
    ["publicAdvocacy", input.publicAdvocacy],
  ] as const;
  const triggeredIndicators = entries.filter(([, on]) => on).map(([id]) => id);
  const conflictIndicatorCount = triggeredIndicators.length;
  return {
    conflictIndicatorCount,
    conflictLevel:
      !input.assignmentOverlapsSupport || conflictIndicatorCount === 0
        ? "none"
        : input.organizationalRole || conflictIndicatorCount >= 2
          ? "reassign"
          : "disclose",
    triggeredIndicators,
  };
};

export const exampleInput = {
  financialSupport: true,
  organizationalRole: false,
  publicAdvocacy: false,
  assignmentOverlapsSupport: true,
} satisfies Input;
export const exampleOutput = {
  conflictIndicatorCount: 1,
  conflictLevel: "disclose",
  triggeredIndicators: ["financialSupport"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      financialSupport: input.financialSupport as boolean,
      organizationalRole: input.organizationalRole as boolean,
      publicAdvocacy: input.publicAdvocacy as boolean,
      assignmentOverlapsSupport: input.assignmentOverlapsSupport as boolean,
    }),
  description: "Screen protest-support facts for assignment conflict.",
  id: "journalism/protest-support-conflict",
  inputs: [
    {
      id: "financialSupport",
      label: "Financial support provided",
      kind: "boolean",
    },
    {
      id: "organizationalRole",
      label: "Organizational role held",
      kind: "boolean",
    },
    { id: "publicAdvocacy", label: "Public advocacy made", kind: "boolean" },
    {
      id: "assignmentOverlapsSupport",
      label: "Assignment overlaps supported cause",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "conflictIndicatorCount",
      label: "Conflict indicator count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "conflictLevel",
      label: "Conflict level",
      kind: "string",
      enum: ["none", "disclose", "reassign"],
    },
    {
      id: "triggeredIndicators",
      label: "Triggered indicators",
      kind: "stringList",
    },
  ],
  title: "Protest Support Conflict",
});

export const run = tool.execute;
export default tool;
