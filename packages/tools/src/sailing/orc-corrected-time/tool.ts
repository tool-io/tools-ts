import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OrcCorrectedTimeInput = {
  readonly elapsedSeconds: number;
  readonly orcCoefficient?: number;
};

export type OrcCorrectedTimeOutput = {
  readonly correctedTimeSeconds: number;
};

const DEFAULT_ORC_COEFFICIENT = 1;

export const orcCorrectedTimeExample = {
  input: { elapsedSeconds: 3600, orcCoefficient: 1.05 },
  output: { correctedTimeSeconds: 3780 },
} satisfies ToolExample<OrcCorrectedTimeInput, OrcCorrectedTimeOutput>;

export const calculateOrcCorrectedTime = (
  input: OrcCorrectedTimeInput,
): OrcCorrectedTimeOutput => {
  if (input.elapsedSeconds <= 0)
    simpleError(
      "elapsedSeconds",
      "The elapsed time must be positive.",
      "invalid_input",
    );
  const orcCoefficient = input.orcCoefficient ?? DEFAULT_ORC_COEFFICIENT;
  if (!(
    Number.isFinite(orcCoefficient) &&
    orcCoefficient >= 0.7 &&
    orcCoefficient <= 1.4
  ))
    simpleError(
      "orcCoefficient",
      "The ORC Time Correction Coefficient must be between 0.7 and 1.4.",
      "invalid_coefficient",
    );
  return {
    correctedTimeSeconds: input.elapsedSeconds * orcCoefficient,
  };
};

export const orcCorrectedTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateOrcCorrectedTime(input as unknown as OrcCorrectedTimeInput),
  description:
    "Compute ORC time-on-time corrected time by multiplying elapsed seconds by the supplied Time Correction Coefficient (TCC).",
  id: "sailing/orc-corrected-time",
  inputs: [
    {
      default: DEFAULT_ORC_COEFFICIENT,
      description:
        "ORC performance coefficient between zero point seven and one point four.",
      format: "factor",
      id: "orcCoefficient",
      kind: "number",
      label: "ORC coefficient",
      maximum: 1.4,
      minimum: 0.7,
    },
    {
      description: "Time on course from start signal to finish.",
      format: "duration-s",
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed time",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Corrected finish time used to score the race.",
      format: "duration-s",
      id: "correctedTimeSeconds",
      kind: "number",
      label: "Corrected time",
      unit: "s",
    },
  ],
  title: "ORC Corrected Time Calculator",
});
export const runOrcCorrectedTime = orcCorrectedTimeTool.execute;
export default orcCorrectedTimeTool;
