import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly windowReferenceMilliseconds: number;
  readonly latencyMilliseconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowReferenceMilliseconds: { type: "number" },
    latencyMilliseconds: { type: "number" },
  },
  required: ["windowReferenceMilliseconds", "latencyMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied auditory latency relative to an explicit reference-window origin in milliseconds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { windowReferenceMilliseconds, latencyMilliseconds } = request;
  const compute = (): Output => {
    return { signedGap: latencyMilliseconds - windowReferenceMilliseconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { windowReferenceMilliseconds: 12, latencyMilliseconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const auditoryLatencyWindowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/auditory-latency-window-offset",
    title: "Auditory Latency Window Offset",
    description:
      "Calculate supplied auditory latency relative to an explicit reference-window origin in milliseconds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowReferenceMilliseconds: { type: "number" },
        latencyMilliseconds: { type: "number" },
      },
      required: ["windowReferenceMilliseconds", "latencyMilliseconds"],
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
          id: "windowReferenceMilliseconds",
          label: "Window Reference Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latencyMilliseconds",
          label: "Latency Milliseconds",
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
export const run = auditoryLatencyWindowOffsetTool.execute;
export default auditoryLatencyWindowOffsetTool;
