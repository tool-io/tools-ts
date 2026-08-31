import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedEvaporationKgM2Second: number;
  readonly latentHeatJkg: number;
}>;
export type Output = Readonly<{
  readonly signedUpwardEvaporativeCoolingWm2: number;
}>;
const inputFields = [
  {
    id: "observedEvaporationKgM2Second",
    label: "Observed evaporation kg m2 second",
    kind: "number",
  },
  { id: "latentHeatJkg", label: "Latent heat jkg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.latentHeatJkg, "latentHeatJkg");
  return {
    signedUpwardEvaporativeCoolingWm2:
      input.observedEvaporationKgM2Second * input.latentHeatJkg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEvaporationKgM2Second: 0.001,
  latentHeatJkg: 2500000,
} satisfies Input;
export const exampleOutput = {
  signedUpwardEvaporativeCoolingWm2: 2500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/evaporative-cooling-flux-lake",
  title: "Evaporative Cooling Flux Lake Calculator",
  description:
    "Convert actual measured mass evaporation flux to signed latent heat flux; negative condensation retained, distinct from energy-budget inversion estimating evaporation.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedUpwardEvaporativeCoolingWm2",
      label: "Signed upward evaporative cooling wm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEvaporationKgM2Second:
        value.observedEvaporationKgM2Second as number,
      latentHeatJkg: value.latentHeatJkg as number,
    }),
});
export const run = tool.execute;
export default tool;
