import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly feedGradeFraction: number;
  readonly concentrateGradeFraction: number;
  readonly tailingsGradeFraction: number;
}>;
export type Output = Readonly<{
  readonly concentrationMassRatio: number;
  readonly concentrateMassFraction: number;
  readonly inferredMetalRecovery: number;
}>;
const inputFields = [
  { id: "feedGradeFraction", label: "Feed grade fraction", kind: "number" },
  {
    id: "concentrateGradeFraction",
    label: "Concentrate grade fraction",
    kind: "number",
  },
  {
    id: "tailingsGradeFraction",
    label: "Tailings grade fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.feedGradeFraction, "feedGradeFraction");
  fraction(input.concentrateGradeFraction, "concentrateGradeFraction");
  fraction(input.tailingsGradeFraction, "tailingsGradeFraction");
  if (!(
    input.concentrateGradeFraction > input.feedGradeFraction &&
    input.feedGradeFraction > input.tailingsGradeFraction
  ))
    simpleError(
      "feedGradeFraction",
      "Strict concentrate > feed > tailings assays required.",
    );
  const concentrateMassFraction =
    (input.feedGradeFraction - input.tailingsGradeFraction) /
    (input.concentrateGradeFraction - input.tailingsGradeFraction);
  return {
    concentrationMassRatio: 1 / concentrateMassFraction,
    concentrateMassFraction,
    inferredMetalRecovery:
      (concentrateMassFraction * input.concentrateGradeFraction) /
      input.feedGradeFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedGradeFraction: 0.1,
  concentrateGradeFraction: 0.5,
  tailingsGradeFraction: 0.02,
} satisfies Input;
export const exampleOutput = {
  concentrationMassRatio: 6,
  concentrateMassFraction: 0.16666666666666666,
  inferredMetalRecovery: 0.8333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/concentration-ratio",
  title: "Concentration Ratio",
  description:
    "Infer concentrate yield and feed/concentrate mass ratio from a closed two-product assay balance; distinct from measured mass pull and assumes representative dry assays.",
  inputs: inputFields,
  outputs: [
    {
      id: "concentrationMassRatio",
      label: "Concentration mass ratio",
      kind: "number",
    },
    {
      id: "concentrateMassFraction",
      label: "Concentrate mass fraction",
      kind: "number",
    },
    {
      id: "inferredMetalRecovery",
      label: "Inferred metal recovery",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feedGradeFraction: value.feedGradeFraction as number,
      concentrateGradeFraction: value.concentrateGradeFraction as number,
      tailingsGradeFraction: value.tailingsGradeFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
