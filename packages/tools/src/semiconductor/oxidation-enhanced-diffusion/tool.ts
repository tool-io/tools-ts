import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedUnoxidizedDiffusivityM2Second: readonly number[];
  readonly observedOxidizedDiffusivityM2Second: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedOxidationEnhancementFactors: readonly number[];
  readonly signedOxidizedMinusBaselineDiffusivities: readonly number[];
}>;
const inputFields = [
  {
    id: "observedUnoxidizedDiffusivityM2Second",
    label: "Observed unoxidized diffusivity m2 second",
    kind: "numberList",
  },
  {
    id: "observedOxidizedDiffusivityM2Second",
    label: "Observed oxidized diffusivity m2 second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedUnoxidizedDiffusivityM2Second.forEach((v) =>
    positive(v, "observedUnoxidizedDiffusivityM2Second"),
  );
  input.observedOxidizedDiffusivityM2Second.forEach((v) =>
    nonnegative(v, "observedOxidizedDiffusivityM2Second"),
  );
  aligned(
    input.observedUnoxidizedDiffusivityM2Second,
    input.observedOxidizedDiffusivityM2Second,
    "observedUnoxidizedDiffusivityM2Second",
  );
  return {
    observedOxidationEnhancementFactors:
      input.observedOxidizedDiffusivityM2Second.map(
        (v, i) => v / input.observedUnoxidizedDiffusivityM2Second[i],
      ),
    signedOxidizedMinusBaselineDiffusivities:
      input.observedOxidizedDiffusivityM2Second.map(
        (v, i) => v - input.observedUnoxidizedDiffusivityM2Second[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUnoxidizedDiffusivityM2Second: [1, 2],
  observedOxidizedDiffusivityM2Second: [2, 6],
} satisfies Input;
export const exampleOutput = {
  observedOxidationEnhancementFactors: [2, 3],
  signedOxidizedMinusBaselineDiffusivities: [1, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/oxidation-enhanced-diffusion",
  title: "Semiconductor Oxidation Enhanced Diffusion Calculator",
  description:
    "Audit actual matched oxidized versus baseline diffusion observations, ratios below one retained; no universal oxidation enhancement or fabricated doping coefficients.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedOxidationEnhancementFactors",
      label: "Observed oxidation enhancement factors",
      kind: "numberList",
    },
    {
      id: "signedOxidizedMinusBaselineDiffusivities",
      label: "Signed oxidized minus baseline diffusivities",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUnoxidizedDiffusivityM2Second:
        value.observedUnoxidizedDiffusivityM2Second as readonly number[],
      observedOxidizedDiffusivityM2Second:
        value.observedOxidizedDiffusivityM2Second as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
