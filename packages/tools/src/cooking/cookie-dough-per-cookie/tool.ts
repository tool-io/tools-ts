import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedDoughMassG: number;
  readonly observedWholeCookieCount: number;
  readonly independentlyUnportionedTrimG: number;
}>;
export type Output = Readonly<{
  readonly observedPortionedMassPerCookieG: number;
}>;
const inputFields = [
  { id: "observedDoughMassG", label: "Observed dough mass g", kind: "number" },
  {
    id: "observedWholeCookieCount",
    label: "Observed whole cookie count",
    kind: "number",
  },
  {
    id: "independentlyUnportionedTrimG",
    label: "Independently unportioned trim g",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedWholeCookieCount, "observedWholeCookieCount");
  nonnegative(input.observedDoughMassG, "observedDoughMassG");
  nonnegative(
    input.independentlyUnportionedTrimG,
    "independentlyUnportionedTrimG",
  );
  integer(input.observedWholeCookieCount, "cookies");
  return {
    observedPortionedMassPerCookieG:
      nonnegative(
        input.observedDoughMassG - input.independentlyUnportionedTrimG,
        "portioned dough",
      ) / input.observedWholeCookieCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDoughMassG: 100,
  observedWholeCookieCount: 4,
  independentlyUnportionedTrimG: 20,
} satisfies Input;
export const exampleOutput = {
  observedPortionedMassPerCookieG: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/cookie-dough-per-cookie",
  title: "Cooking Cookie Dough Per Cookie Calculator",
  description:
    "Actual dough mass per observed whole cookie after independently weighed trim, not intended serving-count scaling or baked-cookie mass. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPortionedMassPerCookieG",
      label: "Observed portioned mass per cookie g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDoughMassG: value.observedDoughMassG as number,
      observedWholeCookieCount: value.observedWholeCookieCount as number,
      independentlyUnportionedTrimG:
        value.independentlyUnportionedTrimG as number,
    }),
});
export const run = tool.execute;
export default tool;
