import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EtchRateInput = {
  readonly etchTimeMinutes: number;
  readonly removedThicknessNm: number;
};

export type EtchRateOutput = {
  readonly etchRateNmPerMinute: number;
};

export const etchRateExample = {
  input: { etchTimeMinutes: 2, removedThicknessNm: 300 },
  output: { etchRateNmPerMinute: 150 },
} satisfies ToolExample<EtchRateInput, EtchRateOutput>;

export const calculateEtchRate = (input: EtchRateInput): EtchRateOutput => {
  if (
    !Number.isFinite(input.removedThicknessNm) ||
    input.removedThicknessNm < 0
  )
    simpleError(
      "removedThicknessNm",
      "Removed thickness must be a finite number at least 0.",
      "invalid_removed_thickness",
    );
  if (!Number.isFinite(input.etchTimeMinutes) || input.etchTimeMinutes <= 0)
    simpleError(
      "etchTimeMinutes",
      "Etch time must be a finite positive number.",
      "invalid_etch_time",
    );
  const etchRateNmPerMinute =
    input.removedThicknessNm === 0
      ? 0
      : input.removedThicknessNm / input.etchTimeMinutes;
  if (
    !Number.isFinite(etchRateNmPerMinute) ||
    (input.removedThicknessNm > 0 && etchRateNmPerMinute === 0)
  )
    simpleError(
      "etchTimeMinutes",
      "Etch rate is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    etchRateNmPerMinute,
  };
};

export const etchRateTool = createSimpleTool({
  calculate: (input) =>
    calculateEtchRate({
      etchTimeMinutes: input.etchTimeMinutes as number,
      removedThicknessNm: input.removedThicknessNm as number,
    }),
  description:
    "Divide the removed thickness (initial film thickness minus final film thickness) by the etch time to get the average etch rate.",
  id: "semiconductor/etch-rate",
  inputs: [
    {
      description:
        "Removed thickness, defined as initial film thickness minus final film thickness. Must be at least 0 nm; 0 nm yields an average rate of 0 nm/min.",
      format: "length",
      id: "removedThicknessNm",
      kind: "number",
      label: "Removed thickness",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Total etch process time. Must be greater than 0 min.",
      format: "duration",
      id: "etchTimeMinutes",
      kind: "number",
      label: "Etch time",
      minimum: Number.MIN_VALUE,
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Average etch rate of the film over the measured interval.",
      format: "rate",
      id: "etchRateNmPerMinute",
      kind: "number",
      label: "Etch rate",
      minimum: 0,
      unit: "nm/min",
    },
  ],
  title: "Etch Rate Calculator",
});
export const runEtchRate = etchRateTool.execute;
export default etchRateTool;
