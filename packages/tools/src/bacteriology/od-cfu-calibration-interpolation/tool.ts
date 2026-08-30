import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, aligned, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly sampleOd: number;
  readonly blankOd: number;
  readonly calibrationCorrectedOds: readonly number[];
  readonly calibrationCfuPerMl: readonly number[];
  readonly dilutionFactor: number;
}>;
export type Output = Readonly<{
  readonly correctedSampleOd: number;
  readonly interpolatedCfuPerMl: number;
  readonly undilutedCfuPerMl: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.calibrationCorrectedOds,
    input.calibrationCfuPerMl,
    "calibrationCorrectedOds",
  );
  ordered(input.calibrationCorrectedOds, "calibrationCorrectedOds");
  input.calibrationCorrectedOds.forEach((v) =>
    nonnegative(v, "calibrationCorrectedOds"),
  );
  input.calibrationCfuPerMl.forEach((v) =>
    nonnegative(v, "calibrationCfuPerMl"),
  );
  nonnegative(input.sampleOd, "sampleOd");
  nonnegative(input.blankOd, "blankOd");
  positive(input.dilutionFactor, "dilutionFactor");
  if (input.dilutionFactor < 1 || input.calibrationCorrectedOds.length < 2)
    simpleError(
      "dilutionFactor",
      "At least two calibration points and dilution factor at least one required.",
    );
  const correctedSampleOd = Math.max(0, input.sampleOd - input.blankOd),
    x = input.calibrationCorrectedOds,
    y = input.calibrationCfuPerMl;
  if (
    correctedSampleOd < x[0] - 1e-12 ||
    correctedSampleOd > x[x.length - 1] + 1e-12
  )
    simpleError(
      "sampleOd",
      "Corrected OD lies outside the calibration range; extrapolation is not inferred.",
    );
  const bounded = Math.min(x[x.length - 1], Math.max(x[0], correctedSampleOd));
  let i = 0;
  while (i < x.length - 2 && x[i + 1] < bounded) i++;
  const interpolatedCfuPerMl =
    y[i] + ((y[i + 1] - y[i]) * (bounded - x[i])) / (x[i + 1] - x[i]);
  return {
    correctedSampleOd,
    interpolatedCfuPerMl,
    undilutedCfuPerMl: interpolatedCfuPerMl * input.dilutionFactor,
  };
};
export const exampleInput = {
  sampleOd: 0.3,
  blankOd: 0.1,
  calibrationCorrectedOds: [0.1, 0.3],
  calibrationCfuPerMl: [1000000, 3000000],
  dilutionFactor: 2,
} satisfies Input;
export const exampleOutput = {
  correctedSampleOd: 0.2,
  interpolatedCfuPerMl: 2000000,
  undilutedCfuPerMl: 4000000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/od-cfu-calibration-interpolation",
  title: "OD Cfu Calibration Interpolation",
  description:
    "Interpolate CFU from an organism- and instrument-specific blank-corrected OD calibration, then undo dilution without out-of-range extrapolation.",
  inputs: [
    { id: "sampleOd", label: "Sample od", kind: "number", minimum: 0 },
    { id: "blankOd", label: "Blank od", kind: "number", minimum: 0 },
    {
      id: "calibrationCorrectedOds",
      label: "Calibration corrected ods",
      kind: "numberList",
    },
    {
      id: "calibrationCfuPerMl",
      label: "Calibration cfu per ml",
      kind: "numberList",
    },
    { id: "dilutionFactor", label: "Dilution factor", kind: "number" },
  ],
  outputs: [
    { id: "correctedSampleOd", label: "Corrected sample od", kind: "number" },
    {
      id: "interpolatedCfuPerMl",
      label: "Interpolated cfu per ml",
      kind: "number",
    },
    { id: "undilutedCfuPerMl", label: "Undiluted cfu per ml", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sampleOd: value.sampleOd as number,
      blankOd: value.blankOd as number,
      calibrationCorrectedOds:
        value.calibrationCorrectedOds as readonly number[],
      calibrationCfuPerMl: value.calibrationCfuPerMl as readonly number[],
      dilutionFactor: value.dilutionFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
