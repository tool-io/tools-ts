import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly holdSeconds: number;
  readonly releaseSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    holdSeconds: { type: "number" },
    releaseSeconds: { type: "number" },
  },
  required: ["holdSeconds", "releaseSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit show hold and release timestamps on a shared timeline without controlling a performance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { holdSeconds, releaseSeconds } = request;
  const compute = (): Output => {
    return { signedGap: releaseSeconds - holdSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { holdSeconds: 12, releaseSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const showReportHoldReleaseDurationTool = H.defineSchemaCalculation<
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
    id: "performing-arts/show-report-hold-release-duration",
    title: "Show Report Hold Release Duration",
    description:
      "Subtract explicit show hold and release timestamps on a shared timeline without controlling a performance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        holdSeconds: { type: "number" },
        releaseSeconds: { type: "number" },
      },
      required: ["holdSeconds", "releaseSeconds"],
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
          id: "holdSeconds",
          label: "Hold Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "releaseSeconds",
          label: "Release Seconds",
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
export const run = showReportHoldReleaseDurationTool.execute;
export default showReportHoldReleaseDurationTool;
