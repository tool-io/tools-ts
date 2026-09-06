import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  extrema,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedScreenAperturesMm: readonly number[];
  readonly observedCorrectlyClassifiedDryTonnes: readonly number[];
  readonly observedTotalAssessedDryTonnes: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedCorrectClassificationFractions: readonly number[];
  readonly bestObservedApertureMm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedScreenAperturesMm",
    label: "Observed screen apertures mm",
    kind: "numberList",
  },
  {
    id: "observedCorrectlyClassifiedDryTonnes",
    label: "Observed correctly classified dry tonnes",
    kind: "numberList",
  },
  {
    id: "observedTotalAssessedDryTonnes",
    label: "Observed total assessed dry tonnes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedScreenAperturesMm.forEach((v) =>
    positive(v, "observedScreenAperturesMm"),
  );
  input.observedTotalAssessedDryTonnes.forEach((v) =>
    positive(v, "observedTotalAssessedDryTonnes"),
  );
  input.observedCorrectlyClassifiedDryTonnes.forEach((v) =>
    nonnegative(v, "observedCorrectlyClassifiedDryTonnes"),
  );
  aligned(
    input.observedScreenAperturesMm,
    input.observedCorrectlyClassifiedDryTonnes,
    "observedScreenAperturesMm",
  );
  aligned(
    input.observedScreenAperturesMm,
    input.observedTotalAssessedDryTonnes,
    "observedScreenAperturesMm",
  );
  const score = input.observedCorrectlyClassifiedDryTonnes.map((v, i) => {
    if (v > input.observedTotalAssessedDryTonnes[i])
      simpleError("screen", "Correct≤total independent classified mass.");
    return v / input.observedTotalAssessedDryTonnes[i];
  });
  const e = extrema(input.observedScreenAperturesMm, score, true);
  return {
    observedCorrectClassificationFractions: score,
    bestObservedApertureMm: e.coordinates,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedScreenAperturesMm: [1, 2, 3],
  observedCorrectlyClassifiedDryTonnes: [2, 3, 4],
  observedTotalAssessedDryTonnes: [4, 4, 4],
} satisfies Input;
export const exampleOutput = {
  observedCorrectClassificationFractions: [0.5, 0.75, 1],
  bestObservedApertureMm: [3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/screen-aperture-efficiency",
  title: "Screen Aperture Efficiency Calculator",
  description:
    "Audit independent correctly classified mass across actual tested apertures and retain tied best samples, distinct from product of coarse/fine recoveries; not optimized unsampled screen aperture. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCorrectClassificationFractions",
      label: "Observed correct classification fractions",
      kind: "numberList",
    },
    {
      id: "bestObservedApertureMm",
      label: "Best observed aperture mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedScreenAperturesMm:
        value.observedScreenAperturesMm as readonly number[],
      observedCorrectlyClassifiedDryTonnes:
        value.observedCorrectlyClassifiedDryTonnes as readonly number[],
      observedTotalAssessedDryTonnes:
        value.observedTotalAssessedDryTonnes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
