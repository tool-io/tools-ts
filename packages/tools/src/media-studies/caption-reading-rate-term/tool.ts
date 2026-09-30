import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characters: number;
  readonly durationSeconds: number;
};
export type Output = { readonly charactersPerSecond: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characters: { type: "integer", minimum: 0 },
    durationSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["characters", "durationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { charactersPerSecond: { type: "number" } },
  required: ["charactersPerSecond"],
} as const;
/** Compute a supplied character-count caption rate; no accessibility threshold is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characters, durationSeconds } = request;
  const compute = (): Output => {
    H.integer(characters, 0);
    H.positive(durationSeconds);
    return { charactersPerSecond: characters / durationSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { characters: 42, durationSeconds: 3 },
  output: { charactersPerSecond: 14 },
} satisfies ToolExample<Input, Output>;
export const captionReadingRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/caption-reading-rate-term",
    title: "Caption Reading Rate Term Tool",
    description:
      "Compute a supplied character-count caption rate; no accessibility threshold is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characters: { type: "integer", minimum: 0 },
        durationSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["characters", "durationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { charactersPerSecond: { type: "number" } },
      required: ["charactersPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "characters",
          label: "Characters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "charactersPerSecond",
          label: "Characters Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = captionReadingRateTermTool.execute;
export default captionReadingRateTermTool;
