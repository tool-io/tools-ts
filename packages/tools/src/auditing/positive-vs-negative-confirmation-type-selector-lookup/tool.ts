import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConfirmationTypeSelectorInput = {
  readonly controlEffective: boolean;
  readonly disputedBalance: boolean;
  readonly highRisk: boolean;
  readonly smallBalance: boolean;
};

export type ConfirmationTypeSelectorOutput = {
  readonly method: "negative" | "positive";
  readonly rationale:
    | "effective_control_and_low_risk"
    | "high_risk_or_dispute"
    | "ineffective_control"
    | "small_balance";
};

export const selectConfirmationType = (
  input: ConfirmationTypeSelectorInput,
): ConfirmationTypeSelectorOutput => {
  for (const field of [
    "controlEffective",
    "disputedBalance",
    "highRisk",
    "smallBalance",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (input.highRisk || input.disputedBalance)
    return { method: "positive", rationale: "high_risk_or_dispute" };
  if (!input.controlEffective)
    return { method: "positive", rationale: "ineffective_control" };
  if (input.smallBalance)
    return { method: "positive", rationale: "small_balance" };
  return {
    method: "negative",
    rationale: "effective_control_and_low_risk",
  };
};

export const confirmationTypeSelectorExample = {
  input: {
    controlEffective: true,
    disputedBalance: false,
    highRisk: false,
    smallBalance: false,
  },
  output: {
    method: "negative",
    rationale: "effective_control_and_low_risk",
  },
} satisfies ToolExample<
  ConfirmationTypeSelectorInput,
  ConfirmationTypeSelectorOutput
>;

export const confirmationTypeSelectorTool = createSimpleTool({
  calculate: (input) =>
    selectConfirmationType({
      controlEffective: input.controlEffective as boolean,
      disputedBalance: input.disputedBalance as boolean,
      highRisk: input.highRisk as boolean,
      smallBalance: input.smallBalance as boolean,
    }),
  description:
    "Select a positive or negative external-confirmation approach from supplied risk, dispute, control-effectiveness, and small-balance facts.",
  id: "auditing/positive-vs-negative-confirmation-type-selector-lookup",
  inputs: [
    { id: "controlEffective", kind: "boolean", label: "Control effective" },
    { id: "disputedBalance", kind: "boolean", label: "Balance disputed" },
    { id: "highRisk", kind: "boolean", label: "High risk" },
    { id: "smallBalance", kind: "boolean", label: "Small balance" },
  ],
  outputs: [
    {
      enum: ["negative", "positive"],
      id: "method",
      kind: "string",
      label: "Confirmation method",
    },
    {
      enum: [
        "effective_control_and_low_risk",
        "high_risk_or_dispute",
        "ineffective_control",
        "small_balance",
      ],
      id: "rationale",
      kind: "string",
      label: "Selection rationale",
    },
  ],
  title: "Positive vs Negative Confirmation Type Selector Lookup",
});

export const runConfirmationTypeSelector = confirmationTypeSelectorTool.execute;
export default confirmationTypeSelectorTool;
