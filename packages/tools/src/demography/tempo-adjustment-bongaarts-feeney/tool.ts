import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TempoAdjustmentBongaartsFeeneyInput = {
  readonly observedTfr: number;
  readonly tempoAdjustmentR: number;
};

export type TempoAdjustmentBongaartsFeeneyOutput = {
  readonly adjustedTfr: number;
};

export const calculateTempoAdjustmentBongaartsFeeney = (
  input: TempoAdjustmentBongaartsFeeneyInput,
): TempoAdjustmentBongaartsFeeneyOutput => {
  if (!(input.observedTfr > 0))
    simpleError(
      "observedTfr",
      "The observed TFR must be greater than zero.",
      "invalid_tfr",
    );
  if (!(Number.isFinite(input.tempoAdjustmentR) && input.tempoAdjustmentR < 1))
    simpleError(
      "tempoAdjustmentR",
      "The tempo adjustment must be finite and below one so the divisor 1 - r remains positive.",
      "invalid_tempo",
    );
  return { adjustedTfr: input.observedTfr / (1 - input.tempoAdjustmentR) };
};

export const tempoAdjustmentBongaartsFeeneyExample = {
  input: { observedTfr: 1.8, tempoAdjustmentR: 0.05 },
  output: { adjustedTfr: 1.8947368421052633 },
} satisfies ToolExample<
  TempoAdjustmentBongaartsFeeneyInput,
  TempoAdjustmentBongaartsFeeneyOutput
>;

export const tempoAdjustmentBongaartsFeeneyTool = createSimpleTool({
  id: "demography/tempo-adjustment-bongaarts-feeney",
  title: "Tempo Adjustment Bongaarts Feeney Calculator",
  description:
    "Apply the Bongaarts-Feeney tempo adjustment, inflating the observed period total fertility rate to TFR / (1 - r) where r is the annual change in the mean age at childbearing.",
  inputs: [
    {
      description: "Observed period total fertility rate.",
      id: "observedTfr",
      kind: "number",
      label: "Observed TFR",
      minimum: 0,
    },
    {
      description:
        "Annual tempo shift r: positive when the mean age at childbearing is rising.",
      id: "tempoAdjustmentR",
      kind: "number",
      label: "Tempo r",
    },
  ],
  outputs: [
    {
      description: "Tempo-adjusted total fertility rate.",
      id: "adjustedTfr",
      kind: "number",
      label: "Adjusted TFR",
    },
  ],
  calculate: (input) =>
    calculateTempoAdjustmentBongaartsFeeney(
      input as unknown as TempoAdjustmentBongaartsFeeneyInput,
    ),
});

export const runTempoAdjustmentBongaartsFeeney =
  tempoAdjustmentBongaartsFeeneyTool.execute;
export default tempoAdjustmentBongaartsFeeneyTool;
