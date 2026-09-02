import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedOppositionFlux: number;
  readonly independentSameBandReferenceFlux: number;
}>;
export type Output = Readonly<{
  readonly observedEnhancementFactor: number;
  readonly signedMagnitudeBrightening: number;
}>;
const inputFields = [
  {
    id: "observedOppositionFlux",
    label: "Observed opposition flux",
    kind: "number",
  },
  {
    id: "independentSameBandReferenceFlux",
    label: "Independent same band reference flux",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedOppositionFlux, "observedOppositionFlux");
  positive(
    input.independentSameBandReferenceFlux,
    "independentSameBandReferenceFlux",
  );
  return {
    observedEnhancementFactor:
      input.observedOppositionFlux / input.independentSameBandReferenceFlux,
    signedMagnitudeBrightening:
      -2.5 *
      Math.log10(
        input.observedOppositionFlux / input.independentSameBandReferenceFlux,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOppositionFlux: 120,
  independentSameBandReferenceFlux: 100,
} satisfies Input;
export const exampleOutput = {
  observedEnhancementFactor: 1.2,
  signedMagnitudeBrightening: -0.19795311511906205,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/opposition-enhanced-brightness-factor",
  title: "Opposition Brightness Enhancement Factor",
  description:
    "Same-passband measured opposition/reference flux contrast, no automatic causal opposition-surge attribution or universal planet factor. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedEnhancementFactor",
      label: "Observed enhancement factor",
      kind: "number",
    },
    {
      id: "signedMagnitudeBrightening",
      label: "Signed magnitude brightening",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOppositionFlux: value.observedOppositionFlux as number,
      independentSameBandReferenceFlux:
        value.independentSameBandReferenceFlux as number,
    }),
});
export const run = tool.execute;
export default tool;
