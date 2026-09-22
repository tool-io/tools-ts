import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialResponse: number;
  readonly laterResponse: number;
  readonly baseline: number;
};
export type Output = {
  readonly correctedInitial: number;
  readonly correctedLater: number;
  readonly retainedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialResponse: { type: "number" },
    laterResponse: { type: "number" },
    baseline: { type: "number" },
  },
  required: ["initialResponse", "laterResponse", "baseline"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedInitial: { type: "number" },
    correctedLater: { type: "number" },
    retainedFraction: { type: "number" },
  },
  required: ["correctedInitial", "correctedLater", "retainedFraction"],
} as const;
/** Ratio of explicitly baseline-corrected observations; no mechanism or habituation diagnosis is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialResponse, laterResponse, baseline } = request;
  const compute = (): Output => {
    H.domain(initialResponse !== baseline);
    return {
      correctedInitial: initialResponse - baseline,
      correctedLater: laterResponse - baseline,
      retainedFraction:
        (laterResponse - baseline) / (initialResponse - baseline),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialResponse: 12, laterResponse: 7, baseline: 2 },
  output: { correctedInitial: 10, correctedLater: 5, retainedFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const habituationOneRepetitionRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/habituation-one-repetition-ratio",
    title: "Habituation One Repetition Ratio Tool",
    description:
      "Ratio of explicitly baseline-corrected observations; no mechanism or habituation diagnosis is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialResponse: { type: "number" },
        laterResponse: { type: "number" },
        baseline: { type: "number" },
      },
      required: ["initialResponse", "laterResponse", "baseline"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedInitial: { type: "number" },
        correctedLater: { type: "number" },
        retainedFraction: { type: "number" },
      },
      required: ["correctedInitial", "correctedLater", "retainedFraction"],
    },
    ports: {
      inputs: [
        {
          id: "initialResponse",
          label: "Initial Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "laterResponse",
          label: "Later Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedInitial",
          label: "Corrected Initial",
          valueType: { type: "number" },
        },
        {
          id: "correctedLater",
          label: "Corrected Later",
          valueType: { type: "number" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = habituationOneRepetitionRatioTool.execute;
export default habituationOneRepetitionRatioTool;
