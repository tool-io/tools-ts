import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  bounded,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerEggEquivalentCount: number;
  readonly callerVerifiedFlaxMassGPerEquivalent: number;
  readonly callerVerifiedGelWaterGPerEquivalent: number;
}>;
export type Output = Readonly<{
  readonly callerFlaxMassG: number;
  readonly callerGelWaterG: number;
}>;
const inputFields = [
  {
    id: "callerEggEquivalentCount",
    label: "Caller egg equivalent count",
    kind: "number",
  },
  {
    id: "callerVerifiedFlaxMassGPerEquivalent",
    label: "Caller verified flax mass g per equivalent",
    kind: "number",
  },
  {
    id: "callerVerifiedGelWaterGPerEquivalent",
    label: "Caller verified gel water g per equivalent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerVerifiedFlaxMassGPerEquivalent,
    "callerVerifiedFlaxMassGPerEquivalent",
  );
  nonnegative(
    input.callerVerifiedGelWaterGPerEquivalent,
    "callerVerifiedGelWaterGPerEquivalent",
  );
  bounded(input.callerEggEquivalentCount, "equivalents", 0, 10000);
  return {
    callerFlaxMassG:
      input.callerEggEquivalentCount *
      input.callerVerifiedFlaxMassGPerEquivalent,
    callerGelWaterG:
      input.callerEggEquivalentCount *
      input.callerVerifiedGelWaterGPerEquivalent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEggEquivalentCount: 2,
  callerVerifiedFlaxMassGPerEquivalent: 10,
  callerVerifiedGelWaterGPerEquivalent: 30,
} satisfies Input;
export const exampleOutput = {
  callerFlaxMassG: 20,
  callerGelWaterG: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/egg-flax-substitution",
  title: "Cooking Egg Flax Substitution Calculator",
  description:
    "Caller explicitly verified recipe-specific flax/gel-water inventory for egg equivalents; no protein/allergen/functional egg equivalence inferred. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    { id: "callerFlaxMassG", label: "Caller flax mass g", kind: "number" },
    { id: "callerGelWaterG", label: "Caller gel water g", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerEggEquivalentCount: value.callerEggEquivalentCount as number,
      callerVerifiedFlaxMassGPerEquivalent:
        value.callerVerifiedFlaxMassGPerEquivalent as number,
      callerVerifiedGelWaterGPerEquivalent:
        value.callerVerifiedGelWaterGPerEquivalent as number,
    }),
});
export const run = tool.execute;
export default tool;
