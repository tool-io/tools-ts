import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly current: boolean; readonly action: string };
export type Output = { readonly next: boolean; readonly changed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    current: { type: "boolean" },
    action: {
      type: "string",
      maxLength: 8192,
      enum: ["opt-in", "opt-out", "unchanged"],
    },
  },
  required: ["current", "action"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { next: { type: "boolean" }, changed: { type: "boolean" } },
  required: ["next", "changed"],
} as const;
/** Apply an explicit preference action to a Boolean state without interpreting consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { current, action } = request;
  const compute = (): Output => {
    H.domain(["opt-in", "opt-out", "unchanged"].includes(action));
    const next = action === "unchanged" ? current : action === "opt-in";
    return { next, changed: next !== current };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { current: false, action: "opt-in" },
  output: { next: true, changed: true },
} satisfies ToolExample<Input, Output>;
export const preferenceConsentOptInStateTransitionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethics/preference-consent-opt-in-state-transition",
      title: "Preference Consent Opt In State Transition Tool",
      description:
        "Apply an explicit preference action to a Boolean state without interpreting consent validity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          current: { type: "boolean" },
          action: {
            type: "string",
            maxLength: 8192,
            enum: ["opt-in", "opt-out", "unchanged"],
          },
        },
        required: ["current", "action"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { next: { type: "boolean" }, changed: { type: "boolean" } },
        required: ["next", "changed"],
      },
      ports: {
        inputs: [
          {
            id: "current",
            label: "Current",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "action",
            label: "Action",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "next", label: "Next", valueType: { type: "boolean" } },
          { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = preferenceConsentOptInStateTransitionTool.execute;
export default preferenceConsentOptInStateTransitionTool;
