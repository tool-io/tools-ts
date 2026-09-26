import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly restrictedSse: number;
  readonly unrestrictedSse: number;
  readonly instruments: number;
  readonly residualDf: number;
};
export type Output = { readonly partialR2: number; readonly partialF: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    restrictedSse: { type: "number", exclusiveMinimum: 0 },
    unrestrictedSse: { type: "number", exclusiveMinimum: 0 },
    instruments: { type: "integer", minimum: 1 },
    residualDf: { type: "integer", minimum: 1 },
  },
  required: ["restrictedSse", "unrestrictedSse", "instruments", "residualDf"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { partialR2: { type: "number" }, partialF: { type: "number" } },
  required: ["partialR2", "partialF"],
} as const;
/** Ordinary homoskedastic nested-model partial F, without a robust weak-instrument statistic or threshold decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { restrictedSse, unrestrictedSse, instruments, residualDf } = request;
  const compute = (): Output => {
    H.positive(restrictedSse);
    H.positive(unrestrictedSse);
    H.domain(restrictedSse >= unrestrictedSse);
    H.integer(instruments, 1);
    H.integer(residualDf, 1);
    return {
      partialR2: (restrictedSse - unrestrictedSse) / restrictedSse,
      partialF:
        ((restrictedSse - unrestrictedSse) * residualDf) /
        (instruments * unrestrictedSse),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    restrictedSse: 100,
    unrestrictedSse: 80,
    instruments: 2,
    residualDf: 40,
  },
  output: { partialR2: 0.2, partialF: 5 },
} satisfies ToolExample<Input, Output>;
export const weakInstrumentFirstStagePartialRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/weak-instrument-first-stage-partial-ratio",
      title: "Weak Instrument First Stage Partial Ratio Tool",
      description:
        "Ordinary homoskedastic nested-model partial F, without a robust weak-instrument statistic or threshold decision.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          restrictedSse: { type: "number", exclusiveMinimum: 0 },
          unrestrictedSse: { type: "number", exclusiveMinimum: 0 },
          instruments: { type: "integer", minimum: 1 },
          residualDf: { type: "integer", minimum: 1 },
        },
        required: [
          "restrictedSse",
          "unrestrictedSse",
          "instruments",
          "residualDf",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          partialR2: { type: "number" },
          partialF: { type: "number" },
        },
        required: ["partialR2", "partialF"],
      },
      ports: {
        inputs: [
          {
            id: "restrictedSse",
            label: "Restricted Sse",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unrestrictedSse",
            label: "Unrestricted Sse",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "instruments",
            label: "Instruments",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "residualDf",
            label: "Residual Df",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "partialR2",
            label: "Partial R2",
            valueType: { type: "number" },
          },
          { id: "partialF", label: "Partial F", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = weakInstrumentFirstStagePartialRatioTool.execute;
export default weakInstrumentFirstStagePartialRatioTool;
