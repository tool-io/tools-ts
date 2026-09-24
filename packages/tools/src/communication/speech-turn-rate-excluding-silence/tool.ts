import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly turns: number;
  readonly elapsedSeconds: number;
  readonly silenceSeconds: number;
};
export type Output = { readonly turnsPerMinute: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turns: { type: "integer", minimum: 0 },
    elapsedSeconds: { type: "number" },
    silenceSeconds: { type: "number", minimum: 0 },
  },
  required: ["turns", "elapsedSeconds", "silenceSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { turnsPerMinute: { type: "number" } },
  required: ["turnsPerMinute"],
} as const;
/** Calculate speech turn rate excluding silence from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { turns, elapsedSeconds, silenceSeconds } = request;
  const compute = (): Output => {
    H.integer(turns, 0);
    H.domain(silenceSeconds >= 0 && elapsedSeconds > silenceSeconds);
    return { turnsPerMinute: (60 * turns) / (elapsedSeconds - silenceSeconds) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { turns: 12, elapsedSeconds: 180, silenceSeconds: 60 },
  output: { turnsPerMinute: 6 },
} satisfies ToolExample<Input, Output>;
export const speechTurnRateExcludingSilenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/speech-turn-rate-excluding-silence",
    title: "Speech Turn Rate Excluding Silence Tool",
    description:
      "Calculate speech turn rate excluding silence from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turns: { type: "integer", minimum: 0 },
        elapsedSeconds: { type: "number" },
        silenceSeconds: { type: "number", minimum: 0 },
      },
      required: ["turns", "elapsedSeconds", "silenceSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { turnsPerMinute: { type: "number" } },
      required: ["turnsPerMinute"],
    },
    ports: {
      inputs: [
        {
          id: "turns",
          label: "Turns",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "silenceSeconds",
          label: "Silence Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "turnsPerMinute",
          label: "Turns Per Minute",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechTurnRateExcludingSilenceTool.execute;
export default speechTurnRateExcludingSilenceTool;
