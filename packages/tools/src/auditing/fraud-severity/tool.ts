import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly intentionalMisstatement: boolean;
  readonly managementInvolved: boolean;
  readonly concealmentEvidence: boolean;
  readonly materialImpact: boolean;
  readonly repeatedConduct: boolean;
}>;
export type Output = Readonly<{
  readonly severityScore: number;
  readonly severity: string;
  readonly immediateEscalation: boolean;
}>;

export const calculate = (input: Input): Output => {
  const severityScore =
    (input.intentionalMisstatement ? 3 : 0) +
    (input.managementInvolved ? 2 : 0) +
    (input.concealmentEvidence ? 3 : 0) +
    (input.materialImpact ? 2 : 0) +
    (input.repeatedConduct ? 1 : 0);
  return {
    severityScore,
    severity:
      severityScore >= 6
        ? "fraud-risk"
        : severityScore >= 3
          ? "gross-negligence"
          : "error-like",
    immediateEscalation:
      (input.managementInvolved && input.intentionalMisstatement) ||
      severityScore >= 6,
  };
};

export const exampleInput = {
  intentionalMisstatement: true,
  managementInvolved: false,
  concealmentEvidence: true,
  materialImpact: false,
  repeatedConduct: false,
} satisfies Input;
export const exampleOutput = {
  severityScore: 6,
  severity: "fraud-risk",
  immediateEscalation: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      intentionalMisstatement: input.intentionalMisstatement as boolean,
      managementInvolved: input.managementInvolved as boolean,
      concealmentEvidence: input.concealmentEvidence as boolean,
      materialImpact: input.materialImpact as boolean,
      repeatedConduct: input.repeatedConduct as boolean,
    }),
  description:
    "Classify potential fraud severity from supplied conduct indicators.",
  id: "auditing/fraud-severity",
  inputs: [
    {
      id: "intentionalMisstatement",
      label: "Intentional misstatement",
      kind: "boolean",
    },
    { id: "managementInvolved", label: "Management involved", kind: "boolean" },
    {
      id: "concealmentEvidence",
      label: "Concealment evidence",
      kind: "boolean",
    },
    { id: "materialImpact", label: "Material impact", kind: "boolean" },
    { id: "repeatedConduct", label: "Repeated conduct", kind: "boolean" },
  ],
  outputs: [
    {
      id: "severityScore",
      label: "Severity score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "severity",
      label: "Severity",
      kind: "string",
      enum: ["error-like", "gross-negligence", "fraud-risk"],
    },
    {
      id: "immediateEscalation",
      label: "Immediate escalation",
      kind: "boolean",
    },
  ],
  title: "Fraud Severity",
});

export const run = tool.execute;
export default tool;
