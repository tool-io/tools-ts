import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FraudBrainstormingInput = {
  readonly consideredManagementOverride: boolean;
  readonly consideredSusceptibilityToFraud: boolean;
  readonly discussedKnownFraudRisks: boolean;
  readonly documentedParticipantsAndConclusions: boolean;
};

export type FraudBrainstormingOutput = {
  readonly complete: boolean;
  readonly completedElementCount: number;
  readonly missingElements: ReadonlyArray<string>;
};

export const assessFraudBrainstormingElements = (
  input: FraudBrainstormingInput,
): FraudBrainstormingOutput => {
  const elements: ReadonlyArray<readonly [string, string, boolean]> = [
    [
      "consideredSusceptibilityToFraud",
      "susceptibility to material misstatement due to fraud",
      input.consideredSusceptibilityToFraud,
    ],
    [
      "discussedKnownFraudRisks",
      "known fraud risks and allegations",
      input.discussedKnownFraudRisks,
    ],
    [
      "consideredManagementOverride",
      "risk of management override",
      input.consideredManagementOverride,
    ],
    [
      "documentedParticipantsAndConclusions",
      "participants and conclusions documented",
      input.documentedParticipantsAndConclusions,
    ],
  ];
  for (const [field, , completed] of elements)
    if (typeof completed !== "boolean")
      simpleError(
        field,
        "Each checklist element must be a boolean.",
        "boolean_field_required",
      );
  const missingElements = elements
    .filter(([, , completed]) => !completed)
    .map(([, name]) => name);
  return {
    complete: missingElements.length === 0,
    completedElementCount: elements.length - missingElements.length,
    missingElements,
  };
};

export const fraudBrainstormingExample = {
  input: {
    consideredManagementOverride: true,
    consideredSusceptibilityToFraud: true,
    discussedKnownFraudRisks: true,
    documentedParticipantsAndConclusions: false,
  },
  output: {
    complete: false,
    completedElementCount: 3,
    missingElements: ["participants and conclusions documented"],
  },
} satisfies ToolExample<FraudBrainstormingInput, FraudBrainstormingOutput>;

export const fraudBrainstormingTool = createSimpleTool({
  calculate: (input) =>
    assessFraudBrainstormingElements({
      consideredManagementOverride:
        input.consideredManagementOverride as boolean,
      consideredSusceptibilityToFraud:
        input.consideredSusceptibilityToFraud as boolean,
      discussedKnownFraudRisks: input.discussedKnownFraudRisks as boolean,
      documentedParticipantsAndConclusions:
        input.documentedParticipantsAndConclusions as boolean,
    }),
  description:
    "Check whether an audit-team fraud discussion addressed susceptibility to fraud, known risks or allegations, management override, and documentation of participants and conclusions. The checklist does not infer that brainstorming is optional when few fraud factors are present.",
  id: "auditing/fraud-brainstorming-session-required-elements-checklist",
  inputs: [
    {
      id: "consideredManagementOverride",
      kind: "boolean",
      label: "Management override considered",
    },
    {
      id: "consideredSusceptibilityToFraud",
      kind: "boolean",
      label: "Fraud susceptibility considered",
    },
    {
      id: "discussedKnownFraudRisks",
      kind: "boolean",
      label: "Known fraud risks discussed",
    },
    {
      id: "documentedParticipantsAndConclusions",
      kind: "boolean",
      label: "Participants and conclusions documented",
    },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Checklist complete" },
    {
      id: "completedElementCount",
      kind: "integer",
      label: "Completed elements",
      maximum: 4,
      minimum: 0,
    },
    { id: "missingElements", kind: "stringList", label: "Missing elements" },
  ],
  title: "Fraud Brainstorming Session Required Elements Checklist",
});

export const runFraudBrainstorming = fraudBrainstormingTool.execute;
export default fraudBrainstormingTool;
