import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly credibleThreat: boolean;
  readonly personalDataExposure: boolean;
  readonly coordinatedAbuse: boolean;
  readonly repeatOffender: boolean;
}>;
export type Output = Readonly<{
  readonly severityScore: number;
  readonly escalationLevel: string;
}>;

export const calculate = (input: Input): Output => {
  const severityScore =
    (input.credibleThreat ? 4 : 0) +
    (input.personalDataExposure ? 3 : 0) +
    (input.coordinatedAbuse ? 2 : 0) +
    (input.repeatOffender ? 1 : 0);
  return {
    severityScore,
    escalationLevel:
      severityScore >= 6
        ? "emergency"
        : severityScore >= 3
          ? "priority"
          : "routine",
  };
};

export const exampleInput = {
  credibleThreat: false,
  personalDataExposure: true,
  coordinatedAbuse: true,
  repeatOffender: false,
} satisfies Input;
export const exampleOutput = {
  severityScore: 5,
  escalationLevel: "priority",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      credibleThreat: input.credibleThreat as boolean,
      personalDataExposure: input.personalDataExposure as boolean,
      coordinatedAbuse: input.coordinatedAbuse as boolean,
      repeatOffender: input.repeatOffender as boolean,
    }),
  description:
    "Classify moderation escalation from supplied safety indicators.",
  id: "journalism/moderation-escalation",
  inputs: [
    { id: "credibleThreat", label: "Credible threat", kind: "boolean" },
    {
      id: "personalDataExposure",
      label: "Personal data exposure",
      kind: "boolean",
    },
    { id: "coordinatedAbuse", label: "Coordinated abuse", kind: "boolean" },
    { id: "repeatOffender", label: "Repeat offender", kind: "boolean" },
  ],
  outputs: [
    {
      id: "severityScore",
      label: "Severity score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "escalationLevel",
      label: "Moderation escalation",
      kind: "string",
      enum: ["routine", "priority", "emergency"],
    },
  ],
  title: "Moderation Escalation",
});

export const run = tool.execute;
export default tool;
