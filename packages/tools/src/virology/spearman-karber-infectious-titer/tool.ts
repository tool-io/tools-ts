import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly firstReciprocalDilution: number;
  readonly foldStep: number;
  readonly positiveWells: readonly number[];
  readonly testedWells: readonly number[];
  readonly inoculumVolumeMl: number;
}>;
export type Output = Readonly<{
  readonly log10Tcid50PerMl: number;
  readonly tcid50PerMl: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.firstReciprocalDilution, "firstReciprocalDilution");
  positive(input.inoculumVolumeMl, "inoculumVolumeMl");
  if (input.foldStep <= 1)
    simpleError("foldStep", "Dilution fold step must exceed one.");
  aligned(input.positiveWells, input.testedWells, "positiveWells");
  const fractions = input.positiveWells.map((v, i) => {
    count(v, "positiveWells");
    count(input.testedWells[i], "testedWells", 1);
    if (v > input.testedWells[i])
      simpleError(
        "positiveWells",
        "Positive wells cannot exceed tested wells.",
      );
    return v / input.testedWells[i];
  });
  if (
    fractions[0] !== 1 ||
    fractions[fractions.length - 1] !== 0 ||
    fractions.some((v, i) => i > 0 && v > fractions[i - 1])
  )
    simpleError(
      "positiveWells",
      "Series must span complete to absent response in monotone dilution order.",
    );
  const log10Tcid50PerMl =
    Math.log10(input.firstReciprocalDilution) +
    Math.log10(input.foldStep) * (fractions.reduce((a, b) => a + b, 0) - 0.5) -
    Math.log10(input.inoculumVolumeMl);
  return { log10Tcid50PerMl, tcid50PerMl: 10 ** log10Tcid50PerMl };
};
export const exampleInput = {
  firstReciprocalDilution: 10,
  foldStep: 10,
  positiveWells: [4, 2, 0],
  testedWells: [4, 4, 4],
  inoculumVolumeMl: 0.1,
} satisfies Input;
export const exampleOutput = {
  log10Tcid50PerMl: 3,
  tcid50PerMl: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/spearman-karber-infectious-titer",
  title: "Spearman Karber Infectious Titer",
  description:
    "Compute a Spearman–Kärber TCID50 estimate from a complete regularly diluted response series; no PFU conversion is assumed.",
  inputs: [
    {
      id: "firstReciprocalDilution",
      label: "First reciprocal dilution",
      kind: "number",
    },
    { id: "foldStep", label: "Fold step", kind: "number" },
    { id: "positiveWells", label: "Positive wells", kind: "numberList" },
    { id: "testedWells", label: "Tested wells", kind: "numberList" },
    { id: "inoculumVolumeMl", label: "Inoculum volume ml", kind: "number" },
  ],
  outputs: [
    { id: "log10Tcid50PerMl", label: "Log 10 tcid 50 per ml", kind: "number" },
    { id: "tcid50PerMl", label: "Tcid 50 per ml", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      firstReciprocalDilution: value.firstReciprocalDilution as number,
      foldStep: value.foldStep as number,
      positiveWells: value.positiveWells as readonly number[],
      testedWells: value.testedWells as readonly number[],
      inoculumVolumeMl: value.inoculumVolumeMl as number,
    }),
});
export const run = tool.execute;
export default tool;
