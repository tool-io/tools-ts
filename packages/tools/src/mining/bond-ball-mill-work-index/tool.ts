import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bondSizeTerm } from "../shared.js";
export type Input = Readonly<{
  readonly closingScreenMicrometers: number;
  readonly gramsPerRevolution: number;
  readonly feedP80Micrometers: number;
  readonly productP80Micrometers: number;
  readonly empiricalConstant: number;
  readonly screenExponent: number;
  readonly grindabilityExponent: number;
}>;
export type Output = Readonly<{
  readonly ballMillWorkIndexKwhPerTonne: number;
}>;
const inputFields = [
  {
    id: "closingScreenMicrometers",
    label: "Closing screen micrometers",
    kind: "number",
  },
  { id: "gramsPerRevolution", label: "Grams per revolution", kind: "number" },
  { id: "feedP80Micrometers", label: "Feed p80 micrometers", kind: "number" },
  {
    id: "productP80Micrometers",
    label: "Product p80 micrometers",
    kind: "number",
  },
  { id: "empiricalConstant", label: "Empirical constant", kind: "number" },
  { id: "screenExponent", label: "Screen exponent", kind: "number" },
  {
    id: "grindabilityExponent",
    label: "Grindability exponent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.closingScreenMicrometers, "closingScreenMicrometers");
  positive(input.gramsPerRevolution, "gramsPerRevolution");
  positive(input.empiricalConstant, "empiricalConstant");
  positive(input.screenExponent, "screenExponent");
  positive(input.grindabilityExponent, "grindabilityExponent");
  return {
    ballMillWorkIndexKwhPerTonne:
      input.empiricalConstant /
      (input.closingScreenMicrometers ** input.screenExponent *
        input.gramsPerRevolution ** input.grindabilityExponent *
        positive(
          bondSizeTerm(input.feedP80Micrometers, input.productP80Micrometers),
          "model",
        )),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  closingScreenMicrometers: 100,
  gramsPerRevolution: 2,
  feedP80Micrometers: 10000,
  productP80Micrometers: 100,
  empiricalConstant: 44.5,
  screenExponent: 0.23,
  grindabilityExponent: 0.82,
} satisfies Input;
export const exampleOutput = {
  ballMillWorkIndexKwhPerTonne: 9.711200149476227,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/bond-ball-mill-work-index",
  title: "Bond Ball Mill Work Index",
  description:
    "Apply a supplied Bond ball-mill laboratory correlation to closing screen and grams/revolution; constant must match test protocol and tonne convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "ballMillWorkIndexKwhPerTonne",
      label: "Ball mill work index kwh per tonne",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      closingScreenMicrometers: value.closingScreenMicrometers as number,
      gramsPerRevolution: value.gramsPerRevolution as number,
      feedP80Micrometers: value.feedP80Micrometers as number,
      productP80Micrometers: value.productP80Micrometers as number,
      empiricalConstant: value.empiricalConstant as number,
      screenExponent: value.screenExponent as number,
      grindabilityExponent: value.grindabilityExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
