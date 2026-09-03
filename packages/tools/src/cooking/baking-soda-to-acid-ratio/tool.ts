import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedAvailableAcidEquivalentsMol: number;
  readonly observedSodaMassG: number;
  readonly callerSodaEquivalentMolarMassGMol: number;
  readonly callerSodaPurity: number;
}>;
export type Output = Readonly<{
  readonly sodaBaseEquivalentsMol: number;
  readonly signedAcidMinusBaseEquivalentsMol: number;
}>;
const inputFields = [
  {
    id: "observedAvailableAcidEquivalentsMol",
    label: "Observed available acid equivalents mol",
    kind: "number",
  },
  { id: "observedSodaMassG", label: "Observed soda mass g", kind: "number" },
  {
    id: "callerSodaEquivalentMolarMassGMol",
    label: "Caller soda equivalent molar mass g mol",
    kind: "number",
  },
  { id: "callerSodaPurity", label: "Caller soda purity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerSodaEquivalentMolarMassGMol,
    "callerSodaEquivalentMolarMassGMol",
  );
  nonnegative(
    input.observedAvailableAcidEquivalentsMol,
    "observedAvailableAcidEquivalentsMol",
  );
  nonnegative(input.observedSodaMassG, "observedSodaMassG");
  fraction(input.callerSodaPurity, "callerSodaPurity");
  const b =
    (input.observedSodaMassG * input.callerSodaPurity) /
    input.callerSodaEquivalentMolarMassGMol;
  return {
    sodaBaseEquivalentsMol: b,
    signedAcidMinusBaseEquivalentsMol:
      input.observedAvailableAcidEquivalentsMol - b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAvailableAcidEquivalentsMol: 0.1,
  observedSodaMassG: 10,
  callerSodaEquivalentMolarMassGMol: 100,
  callerSodaPurity: 0.8,
} satisfies Input;
export const exampleOutput = {
  sodaBaseEquivalentsMol: 0.08,
  signedAcidMinusBaseEquivalentsMol: 0.02,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/baking-soda-to-acid-ratio",
  title: "Cooking Baking Soda To Acid Ratio Calculator",
  description:
    "Independent available acid equivalents vs baking-soda neutralization equivalents, not arbitrary acid ingredient weight or pH/recipe prescription. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "sodaBaseEquivalentsMol",
      label: "Soda base equivalents mol",
      kind: "number",
    },
    {
      id: "signedAcidMinusBaseEquivalentsMol",
      label: "Signed acid minus base equivalents mol",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAvailableAcidEquivalentsMol:
        value.observedAvailableAcidEquivalentsMol as number,
      observedSodaMassG: value.observedSodaMassG as number,
      callerSodaEquivalentMolarMassGMol:
        value.callerSodaEquivalentMolarMassGMol as number,
      callerSodaPurity: value.callerSodaPurity as number,
    }),
});
export const run = tool.execute;
export default tool;
