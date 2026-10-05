import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantCode: string;
  readonly choice: string;
};
export type Output = { readonly label: string; readonly optedIn: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantCode: { type: "string", maxLength: 8192 },
    choice: {
      type: "string",
      maxLength: 8192,
      enum: ["opt-in", "decline", "undecided", "withdrawn"],
    },
  },
  required: ["participantCode", "choice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    optedIn: { type: "boolean" },
  },
  required: ["label", "optedIn"],
} as const;
/** Render an explicitly recorded reconciliation-participation choice without treating silence as consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantCode, choice } = request;
  const compute = (): Output => {
    H.domain(participantCode.length > 0, "participantCode");
    H.domain(
      ["opt-in", "decline", "undecided", "withdrawn"].includes(choice),
      "choice",
    );
    return {
      label: participantCode + " [" + choice + "]",
      optedIn: choice === "opt-in",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participantCode: "P17", choice: "undecided" },
  output: { label: "P17 [undecided]", optedIn: false },
} satisfies ToolExample<Input, Output>;
export const reconciliationConsentChoiceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "peace-studies/reconciliation-consent-choice-label",
    title: "Reconciliation Consent Choice Label Tool",
    description:
      "Render an explicitly recorded reconciliation-participation choice without treating silence as consent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantCode: { type: "string", maxLength: 8192 },
        choice: {
          type: "string",
          maxLength: 8192,
          enum: ["opt-in", "decline", "undecided", "withdrawn"],
        },
      },
      required: ["participantCode", "choice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        optedIn: { type: "boolean" },
      },
      required: ["label", "optedIn"],
    },
    ports: {
      inputs: [
        {
          id: "participantCode",
          label: "Participant Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "choice",
          label: "Choice",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "optedIn", label: "Opted In", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = reconciliationConsentChoiceLabelTool.execute;
export default reconciliationConsentChoiceLabelTool;
