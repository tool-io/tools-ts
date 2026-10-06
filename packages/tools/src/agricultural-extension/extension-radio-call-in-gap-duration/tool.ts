import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCallEndSeconds: number;
  readonly nextCallStartSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCallEndSeconds: { type: "number" },
    nextCallStartSeconds: { type: "number" },
  },
  required: ["previousCallEndSeconds", "nextCallStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit radio call-in markers in seconds, preserving overlap as a negative gap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCallEndSeconds, nextCallStartSeconds } = request;
  const compute = (): Output => {
    return { signedGap: nextCallStartSeconds - previousCallEndSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCallEndSeconds: 12, nextCallStartSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const extensionRadioCallInGapDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/extension-radio-call-in-gap-duration",
    title: "Extension Radio Call In Gap Duration",
    description:
      "Subtract explicit radio call-in markers in seconds, preserving overlap as a negative gap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCallEndSeconds: { type: "number" },
        nextCallStartSeconds: { type: "number" },
      },
      required: ["previousCallEndSeconds", "nextCallStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "previousCallEndSeconds",
          label: "Previous Call End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextCallStartSeconds",
          label: "Next Call Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = extensionRadioCallInGapDurationTool.execute;
export default extensionRadioCallInGapDurationTool;
