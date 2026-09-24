import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modeIndex: number;
  readonly sampleCount: number;
  readonly sampleRate: number;
  readonly positiveNyquist: boolean;
};
export type Output = {
  readonly foldedIndex: number;
  readonly frequency: number;
  readonly nyquistTie: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modeIndex: { type: "integer" },
    sampleCount: { type: "integer", minimum: 1 },
    sampleRate: { type: "number", exclusiveMinimum: 0 },
    positiveNyquist: { type: "boolean" },
  },
  required: ["modeIndex", "sampleCount", "sampleRate", "positiveNyquist"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foldedIndex: { type: "integer" },
    frequency: { type: "number" },
    nyquistTie: { type: "boolean" },
  },
  required: ["foldedIndex", "frequency", "nyquistTie"],
} as const;
/** Calculate discrete mode frequency fold from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modeIndex, sampleCount, sampleRate, positiveNyquist } = request;
  const compute = (): Output => {
    H.integer(sampleCount, 1);
    H.positive(sampleRate);
    return (() => {
      const n = BigInt(sampleCount),
        r = Number(((BigInt(modeIndex) % n) + n) % n),
        nyquistTie = sampleCount % 2 === 0 && r === sampleCount / 2,
        foldedIndex =
          r > sampleCount / 2 || (nyquistTie && !positiveNyquist)
            ? r - sampleCount
            : r;
      return {
        foldedIndex,
        frequency: (foldedIndex / sampleCount) * sampleRate,
        nyquistTie,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    modeIndex: 7,
    sampleCount: 8,
    sampleRate: 80,
    positiveNyquist: true,
  },
  output: { foldedIndex: -1, frequency: -10, nyquistTie: false },
} satisfies ToolExample<Input, Output>;
export const discreteModeFrequencyFoldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/discrete-mode-frequency-fold",
    title: "Discrete Mode Frequency Fold Tool",
    description:
      "Calculate discrete mode frequency fold from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modeIndex: { type: "integer" },
        sampleCount: { type: "integer", minimum: 1 },
        sampleRate: { type: "number", exclusiveMinimum: 0 },
        positiveNyquist: { type: "boolean" },
      },
      required: ["modeIndex", "sampleCount", "sampleRate", "positiveNyquist"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foldedIndex: { type: "integer" },
        frequency: { type: "number" },
        nyquistTie: { type: "boolean" },
      },
      required: ["foldedIndex", "frequency", "nyquistTie"],
    },
    ports: {
      inputs: [
        {
          id: "modeIndex",
          label: "Mode Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleCount",
          label: "Sample Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleRate",
          label: "Sample Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "positiveNyquist",
          label: "Positive Nyquist",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "foldedIndex",
          label: "Folded Index",
          valueType: { type: "integer" },
        },
        { id: "frequency", label: "Frequency", valueType: { type: "number" } },
        {
          id: "nyquistTie",
          label: "Nyquist Tie",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = discreteModeFrequencyFoldTool.execute;
export default discreteModeFrequencyFoldTool;
