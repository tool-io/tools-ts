import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialId: string;
  readonly discardReason: string;
  readonly allowedReasons: readonly string[];
};
export type Output = {
  readonly discarded: boolean;
  readonly reasonRecognized: boolean;
  readonly trialKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialId: { type: "string", maxLength: 8192 },
    discardReason: { type: "string", maxLength: 8192 },
    allowedReasons: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["trialId", "discardReason", "allowedReasons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discarded: { type: "boolean" },
    reasonRecognized: { type: "boolean" },
    trialKey: { type: "string", maxLength: 8192 },
  },
  required: ["discarded", "reasonRecognized", "trialKey"],
} as const;
/** Preserve a supplied research trial discard annotation without selecting performance criteria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialId, discardReason, allowedReasons } = request;
  const compute = (): Output => {
    return {
      discarded: discardReason !== "",
      reasonRecognized:
        discardReason === "" || allowedReasons.includes(discardReason),
      trialKey: JSON.stringify([trialId, discardReason]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trialId: "T2",
    discardReason: "slip",
    allowedReasons: ["slip", "device"],
  },
  output: {
    discarded: true,
    reasonRecognized: true,
    trialKey: '["T2","slip"]',
  },
} satisfies ToolExample<Input, Output>;
export const gripTrialDiscardReasonTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/grip-trial-discard-reason-token",
    title: "Grip Trial Discard Reason Token Tool",
    description:
      "Preserve a supplied research trial discard annotation without selecting performance criteria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialId: { type: "string", maxLength: 8192 },
        discardReason: { type: "string", maxLength: 8192 },
        allowedReasons: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["trialId", "discardReason", "allowedReasons"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discarded: { type: "boolean" },
        reasonRecognized: { type: "boolean" },
        trialKey: { type: "string", maxLength: 8192 },
      },
      required: ["discarded", "reasonRecognized", "trialKey"],
    },
    ports: {
      inputs: [
        {
          id: "trialId",
          label: "Trial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "discardReason",
          label: "Discard Reason",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedReasons",
          label: "Allowed Reasons",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "discarded", label: "Discarded", valueType: { type: "boolean" } },
        {
          id: "reasonRecognized",
          label: "Reason Recognized",
          valueType: { type: "boolean" },
        },
        { id: "trialKey", label: "Trial Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gripTrialDiscardReasonTokenTool.execute;
export default gripTrialDiscardReasonTokenTool;
