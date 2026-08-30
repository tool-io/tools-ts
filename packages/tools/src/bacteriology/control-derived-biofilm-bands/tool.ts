import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, mean } from "../shared.js";

export type Input = Readonly<{
  readonly sampleOds: readonly number[];
  readonly negativeControlOds: readonly number[];
  readonly cutoffSdMultiplier: number;
}>;
export type Output = Readonly<{
  readonly controlCutoffOd: number;
  readonly formationBands: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  if (!input.sampleOds.length || input.negativeControlOds.length < 2)
    simpleError(
      "negativeControlOds",
      "Samples and at least two negative controls required.",
    );
  [...input.sampleOds, ...input.negativeControlOds].forEach((v) =>
    nonnegative(v, "sampleOds"),
  );
  nonnegative(input.cutoffSdMultiplier, "cutoffSdMultiplier");
  const m = mean(input.negativeControlOds),
    sd = Math.sqrt(
      input.negativeControlOds.reduce((sum, v) => sum + (v - m) ** 2, 0) /
        (input.negativeControlOds.length - 1),
    ),
    controlCutoffOd = m + input.cutoffSdMultiplier * sd;
  positive(controlCutoffOd, "negativeControlOds");
  const within = (value: number, limit: number) =>
    value <=
    limit + Number.EPSILON * 8 * Math.max(Math.abs(value), Math.abs(limit));
  return {
    controlCutoffOd,
    formationBands: input.sampleOds.map((v) =>
      within(v, controlCutoffOd)
        ? "none"
        : within(v, 2 * controlCutoffOd)
          ? "weak"
          : within(v, 4 * controlCutoffOd)
            ? "moderate"
            : "strong",
    ),
  };
};
export const exampleInput = {
  sampleOds: [0.1, 0.3, 0.6],
  negativeControlOds: [0.08, 0.1, 0.12],
  cutoffSdMultiplier: 3,
} satisfies Input;
export const exampleOutput = {
  controlCutoffOd: 0.16,
  formationBands: ["none", "weak", "moderate"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/control-derived-biofilm-bands",
  title: "Control Derived Biofilm Bands",
  description:
    "Classify crystal-violet biofilm OD using a supplied control-SD cutoff and conventional 1×/2×/4× bands; these are assay bands, not clinical severity.",
  inputs: [
    { id: "sampleOds", label: "Sample ods", kind: "numberList" },
    {
      id: "negativeControlOds",
      label: "Negative control ods",
      kind: "numberList",
    },
    {
      id: "cutoffSdMultiplier",
      label: "Cutoff sd multiplier",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "controlCutoffOd", label: "Control cutoff od", kind: "number" },
    { id: "formationBands", label: "Formation bands", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      sampleOds: value.sampleOds as readonly number[],
      negativeControlOds: value.negativeControlOds as readonly number[],
      cutoffSdMultiplier: value.cutoffSdMultiplier as number,
    }),
});
export const run = tool.execute;
export default tool;
