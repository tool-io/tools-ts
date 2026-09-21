import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly windowOrigin: number;
  readonly windowLength: number;
};
export type Output = { readonly windowIndex: number; readonly offset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "integer" },
    windowOrigin: { type: "integer" },
    windowLength: { type: "integer", minimum: 1 },
  },
  required: ["eventTime", "windowOrigin", "windowLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { windowIndex: { type: "integer" }, offset: { type: "integer" } },
  required: ["windowIndex", "offset"],
} as const;
/** Place one supplied event in fixed half-open cap windows with exact negative-time carry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, windowOrigin, windowLength } = request;
  const compute = (): Output => {
    H.integer(windowLength, 1);
    const d = BigInt(eventTime) - BigInt(windowOrigin),
      n = BigInt(windowLength);
    let q = d / n,
      r = d % n;
    if (r < 0n) {
      q--;
      r += n;
    }
    return { windowIndex: Number(q), offset: Number(r) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 125, windowOrigin: 100, windowLength: 10 },
  output: { windowIndex: 2, offset: 5 },
} satisfies ToolExample<Input, Output>;
export const frequencyCapWindowOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/frequency-cap-window-offset",
    title: "Frequency Cap Window Offset Tool",
    description:
      "Place one supplied event in fixed half-open cap windows with exact negative-time carry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "integer" },
        windowOrigin: { type: "integer" },
        windowLength: { type: "integer", minimum: 1 },
      },
      required: ["eventTime", "windowOrigin", "windowLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        windowIndex: { type: "integer" },
        offset: { type: "integer" },
      },
      required: ["windowIndex", "offset"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowOrigin",
          label: "Window Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowLength",
          label: "Window Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "windowIndex",
          label: "Window Index",
          valueType: { type: "integer" },
        },
        { id: "offset", label: "Offset", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = frequencyCapWindowOffsetTool.execute;
export default frequencyCapWindowOffsetTool;
