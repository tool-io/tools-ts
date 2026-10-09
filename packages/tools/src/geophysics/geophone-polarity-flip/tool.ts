import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amplitude: number;
  readonly reversePolarity: boolean;
};
export type Output = { readonly correctedAmplitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amplitude: { type: "number" },
    reversePolarity: { type: "boolean" },
  },
  required: ["amplitude", "reversePolarity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedAmplitude: { type: "number" } },
  required: ["correctedAmplitude"],
} as const;
/** Apply an explicit geophone polarity reversal without inferring sensor orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amplitude, reversePolarity } = request;
  const compute = (): Output => {
    return { correctedAmplitude: reversePolarity ? -amplitude : amplitude };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amplitude: 2.5, reversePolarity: true },
  output: { correctedAmplitude: -2.5 },
} satisfies ToolExample<Input, Output>;
export const geophonePolarityFlipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geophysics", "physics"],
      keywords: ["geophysics", "physics"],
    },
    id: "geophysics/geophone-polarity-flip",
    title: "Geophone Polarity Flip",
    description:
      "Apply an explicit geophone polarity reversal without inferring sensor orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amplitude: { type: "number" },
        reversePolarity: { type: "boolean" },
      },
      required: ["amplitude", "reversePolarity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedAmplitude: { type: "number" } },
      required: ["correctedAmplitude"],
    },
    ports: {
      inputs: [
        {
          id: "amplitude",
          label: "Amplitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reversePolarity",
          label: "Reverse Polarity",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "correctedAmplitude",
          label: "Corrected Amplitude",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = geophonePolarityFlipTool.execute;
export default geophonePolarityFlipTool;
