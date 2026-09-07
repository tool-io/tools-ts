import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedMziBrightWatts: number;
  readonly observedMziDarkWatts: number;
  readonly observedIndependentDetectorBackgroundWatts: number;
}>;
export type Output = Readonly<{
  readonly backgroundCorrectedMziExtinctionRatio: number;
  readonly backgroundCorrectedMziExtinctionDb: number;
}>;
const inputFields = [
  {
    id: "observedMziBrightWatts",
    label: "Observed mzi bright watts",
    kind: "number",
  },
  {
    id: "observedMziDarkWatts",
    label: "Observed mzi dark watts",
    kind: "number",
  },
  {
    id: "observedIndependentDetectorBackgroundWatts",
    label: "Observed independent detector background watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedMziBrightWatts, "observedMziBrightWatts");
  nonnegative(input.observedMziDarkWatts, "observedMziDarkWatts");
  nonnegative(
    input.observedIndependentDetectorBackgroundWatts,
    "observedIndependentDetectorBackgroundWatts",
  );
  const bright =
      input.observedMziBrightWatts -
      input.observedIndependentDetectorBackgroundWatts,
    dark =
      input.observedMziDarkWatts -
      input.observedIndependentDetectorBackgroundWatts;
  positive(bright, "correctedBright");
  positive(dark, "correctedDark");
  const ratio = bright / dark;
  return {
    backgroundCorrectedMziExtinctionRatio: ratio,
    backgroundCorrectedMziExtinctionDb: 10 * Math.log10(ratio),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMziBrightWatts: 10,
  observedMziDarkWatts: 2,
  observedIndependentDetectorBackgroundWatts: 1,
} satisfies Input;
export const exampleOutput = {
  backgroundCorrectedMziExtinctionRatio: 9,
  backgroundCorrectedMziExtinctionDb: 9.542425094393248,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/silicon-photonics-mach-zehnder-extinction-ratio",
  title:
    "Semiconductor Silicon Photonics Mach Zehnder Extinction Ratio Calculator",
  description:
    "Extract actual Mach–Zehnder extinction after independent detector background subtraction, signed dB retained if labels reversed; not ideal phase transmission or raw power ratio.",
  inputs: inputFields,
  outputs: [
    {
      id: "backgroundCorrectedMziExtinctionRatio",
      label: "Background corrected mzi extinction ratio",
      kind: "number",
    },
    {
      id: "backgroundCorrectedMziExtinctionDb",
      label: "Background corrected mzi extinction db",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMziBrightWatts: value.observedMziBrightWatts as number,
      observedMziDarkWatts: value.observedMziDarkWatts as number,
      observedIndependentDetectorBackgroundWatts:
        value.observedIndependentDetectorBackgroundWatts as number,
    }),
});
export const run = tool.execute;
export default tool;
