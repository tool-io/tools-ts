import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headMarkerSeconds: number;
  readonly eyeMarkerSeconds: number;
};
export type Output = { readonly eyeMinusHeadSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headMarkerSeconds: { type: "number" },
    eyeMarkerSeconds: { type: "number" },
  },
  required: ["headMarkerSeconds", "eyeMarkerSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eyeMinusHeadSeconds: { type: "number" } },
  required: ["eyeMinusHeadSeconds"],
} as const;
/** Compare explicitly marked head and eye event times without identifying reflex latency or normality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headMarkerSeconds, eyeMarkerSeconds } = request;
  const compute = (): Output => {
    return { eyeMinusHeadSeconds: eyeMarkerSeconds - headMarkerSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headMarkerSeconds: 2, eyeMarkerSeconds: 2.05 },
  output: { eyeMinusHeadSeconds: 0.04999999999999982 },
} satisfies ToolExample<Input, Output>;
export const vestibularHeadEyeTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["otolaryngology", "health and medicine"],
      keywords: ["otolaryngology", "health and medicine"],
    },
    id: "otolaryngology/vestibular-head-eye-time-offset",
    title: "Vestibular Head Eye Time Offset",
    description:
      "Compare explicitly marked head and eye event times without identifying reflex latency or normality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headMarkerSeconds: { type: "number" },
        eyeMarkerSeconds: { type: "number" },
      },
      required: ["headMarkerSeconds", "eyeMarkerSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { eyeMinusHeadSeconds: { type: "number" } },
      required: ["eyeMinusHeadSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "headMarkerSeconds",
          label: "Head Marker Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eyeMarkerSeconds",
          label: "Eye Marker Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eyeMinusHeadSeconds",
          label: "Eye Minus Head Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vestibularHeadEyeTimeOffsetTool.execute;
export default vestibularHeadEyeTimeOffsetTool;
