import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cueId: string;
  readonly triggerSeconds: number;
  readonly cueSeconds: number;
};
export type Output = {
  readonly signedDelaySeconds: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cueId: { type: "string", maxLength: 8192, minLength: 1 },
    triggerSeconds: { type: "number" },
    cueSeconds: { type: "number" },
  },
  required: ["cueId", "triggerSeconds", "cueSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDelaySeconds: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["signedDelaySeconds", "label"],
} as const;
/** Label the signed delay between explicit trigger and cue markers without controlling stage equipment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cueId, triggerSeconds, cueSeconds } = request;
  const compute = (): Output => {
    H.domain(cueId.length > 0, "cueId");
    return {
      signedDelaySeconds: cueSeconds - triggerSeconds,
      label: cueId + "; delay=" + (cueSeconds - triggerSeconds) + " s",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cueId: "C17", triggerSeconds: 10, cueSeconds: 12 },
  output: { signedDelaySeconds: 2, label: "C17; delay=2 s" },
} satisfies ToolExample<Input, Output>;
export const cueTriggerRelativeDelayLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["performing-arts", "performing arts", "arts and design"],
      keywords: ["performing arts", "arts and design"],
    },
    id: "performing-arts/cue-trigger-relative-delay-label",
    title: "Cue Trigger Relative Delay Label",
    description:
      "Label the signed delay between explicit trigger and cue markers without controlling stage equipment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cueId: { type: "string", maxLength: 8192, minLength: 1 },
        triggerSeconds: { type: "number" },
        cueSeconds: { type: "number" },
      },
      required: ["cueId", "triggerSeconds", "cueSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDelaySeconds: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["signedDelaySeconds", "label"],
    },
    ports: {
      inputs: [
        {
          id: "cueId",
          label: "Cue Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "triggerSeconds",
          label: "Trigger Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cueSeconds",
          label: "Cue Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDelaySeconds",
          label: "Signed Delay Seconds",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = cueTriggerRelativeDelayLabelTool.execute;
export default cueTriggerRelativeDelayLabelTool;
