import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedConsommeEggWhiteMassG: number;
  readonly observedStockMassG: number;
  readonly callerConsommeEggWhitePerStockMassRatio: number;
}>;
export type Output = Readonly<{
  readonly observedMassRatio: number;
  readonly signedRecipeMassDiscrepancyG: number;
}>;
const inputFields = [
  {
    id: "observedConsommeEggWhiteMassG",
    label: "Observed consomme egg white mass g",
    kind: "number",
  },
  { id: "observedStockMassG", label: "Observed stock mass g", kind: "number" },
  {
    id: "callerConsommeEggWhitePerStockMassRatio",
    label: "Caller consomme egg white per stock mass ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedStockMassG, "observedStockMassG");
  nonnegative(
    input.observedConsommeEggWhiteMassG,
    "observedConsommeEggWhiteMassG",
  );
  nonnegative(
    input.callerConsommeEggWhitePerStockMassRatio,
    "callerConsommeEggWhitePerStockMassRatio",
  );
  return {
    observedMassRatio:
      input.observedConsommeEggWhiteMassG / input.observedStockMassG,
    signedRecipeMassDiscrepancyG:
      input.observedConsommeEggWhiteMassG -
      input.observedStockMassG * input.callerConsommeEggWhitePerStockMassRatio,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConsommeEggWhiteMassG: 20,
  observedStockMassG: 100,
  callerConsommeEggWhitePerStockMassRatio: 0.15,
} satisfies Input;
export const exampleOutput = {
  observedMassRatio: 0.2,
  signedRecipeMassDiscrepancyG: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/consomme-egg-white-per-liter",
  title: "Cooking Consomme Egg White Per Liter Calculator",
  description:
    "Audit actual ConsommeEggWhite/Stock ingredient masses against independently specified recipe ratio; all masses are same as-used basis, no universal recipe, emulsion/texture or extraction guarantee. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "observedMassRatio", label: "Observed mass ratio", kind: "number" },
    {
      id: "signedRecipeMassDiscrepancyG",
      label: "Signed recipe mass discrepancy g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConsommeEggWhiteMassG:
        value.observedConsommeEggWhiteMassG as number,
      observedStockMassG: value.observedStockMassG as number,
      callerConsommeEggWhitePerStockMassRatio:
        value.callerConsommeEggWhitePerStockMassRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
