import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch-shared.js";
export type Input = Readonly<{
  readonly wavelengthNanometers: number;
  readonly displayGammaHeuristic: number;
}>;
export type Output = Readonly<{
  readonly approximateDisplayRgb: readonly number[];
  readonly visibilityAttenuationFraction: number;
}>;
const inputFields = [
  {
    id: "wavelengthNanometers",
    label: "Wavelength nanometers",
    kind: "number",
  },
  {
    id: "displayGammaHeuristic",
    label: "Display gamma heuristic",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.displayGammaHeuristic, "displayGammaHeuristic");
  const w = input.wavelengthNanometers;
  if (w < 380 || w > 780 || input.displayGammaHeuristic > 3)
    simpleError(
      "wavelength",
      "Visible heuristic limited to 380–780 nm and gamma in (0,3].",
    );
  let c: number[];
  if (w < 440) c = [(440 - w) / 60, 0, 1];
  else if (w < 490) c = [0, (w - 440) / 50, 1];
  else if (w < 510) c = [0, 1, (510 - w) / 20];
  else if (w < 580) c = [(w - 510) / 70, 1, 0];
  else if (w < 645) c = [1, (645 - w) / 65, 0];
  else c = [1, 0, 0];
  const attenuation =
    w < 420
      ? 0.3 + (0.7 * (w - 380)) / 40
      : w <= 700
        ? 1
        : 0.3 + (0.7 * (780 - w)) / 80;
  return {
    approximateDisplayRgb: c.map(
      (v) => (v * attenuation) ** input.displayGammaHeuristic,
    ),
    visibilityAttenuationFraction: attenuation,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  wavelengthNanometers: 510,
  displayGammaHeuristic: 0.8,
} satisfies Input;
export const exampleOutput = {
  approximateDisplayRgb: [0, 1, 0],
  visibilityAttenuationFraction: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/wavelength-nm-to-approx-rgb",
  title: "Wavelength nm to Approx RGB",
  description:
    "Approximate visible-wavelength display RGB using explicit piecewise artist heuristic and gamma/edge attenuation; no colorimetric spectral integration, actual monitor gamut equivalence or observer sensitivity curve.",
  inputs: inputFields,
  outputs: [
    {
      id: "approximateDisplayRgb",
      label: "Approximate display rgb",
      kind: "numberList",
    },
    {
      id: "visibilityAttenuationFraction",
      label: "Visibility attenuation fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      wavelengthNanometers: value.wavelengthNanometers as number,
      displayGammaHeuristic: value.displayGammaHeuristic as number,
    }),
});
export const run = tool.execute;
export default tool;
