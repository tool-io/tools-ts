import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characters: number;
  readonly rate: number;
  readonly fadeSeconds: number;
};
export type Output = {
  readonly readingSeconds: number;
  readonly cueSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characters: { type: "integer", minimum: 0 },
    rate: { type: "number", exclusiveMinimum: 0 },
    fadeSeconds: { type: "number", minimum: 0 },
  },
  required: ["characters", "rate", "fadeSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readingSeconds: { type: "number" },
    cueSeconds: { type: "number" },
  },
  required: ["readingSeconds", "cueSeconds"],
} as const;
/** Calculate surtitles reading time character term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characters, rate, fadeSeconds } = request;
  const compute = (): Output => {
    H.integer(characters, 0);
    H.positive(rate);
    H.domain(fadeSeconds >= 0);
    return {
      readingSeconds: characters / rate,
      cueSeconds: characters / rate + fadeSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { characters: 60, rate: 15, fadeSeconds: 1 },
  output: { readingSeconds: 4, cueSeconds: 5 },
} satisfies ToolExample<Input, Output>;
export const surtitlesReadingTimeCharacterTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/surtitles-reading-time-character-term",
    title: "Surtitles Reading Time Character Term Tool",
    description:
      "Calculate surtitles reading time character term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characters: { type: "integer", minimum: 0 },
        rate: { type: "number", exclusiveMinimum: 0 },
        fadeSeconds: { type: "number", minimum: 0 },
      },
      required: ["characters", "rate", "fadeSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readingSeconds: { type: "number" },
        cueSeconds: { type: "number" },
      },
      required: ["readingSeconds", "cueSeconds"],
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
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fadeSeconds",
          label: "Fade Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "readingSeconds",
          label: "Reading Seconds",
          valueType: { type: "number" },
        },
        {
          id: "cueSeconds",
          label: "Cue Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = surtitlesReadingTimeCharacterTermTool.execute;
export default surtitlesReadingTimeCharacterTermTool;
