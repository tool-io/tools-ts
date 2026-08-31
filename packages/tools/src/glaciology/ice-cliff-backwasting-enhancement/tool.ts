import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly cliffNormalBackwastingMDay: number;
  readonly referenceFlatIceMeltMDay: number;
  readonly cliffFaceAreaM2: number;
  readonly representedPlanAreaM2: number;
}>;
export type Output = Readonly<{
  readonly observedNormalBackwastingEnhancement: number;
  readonly planAreaEquivalentEnhancement: number;
}>;
const inputFields = [
  {
    id: "cliffNormalBackwastingMDay",
    label: "Cliff normal backwasting m day",
    kind: "number",
  },
  {
    id: "referenceFlatIceMeltMDay",
    label: "Reference flat ice melt m day",
    kind: "number",
  },
  { id: "cliffFaceAreaM2", label: "Cliff face area m2", kind: "number" },
  {
    id: "representedPlanAreaM2",
    label: "Represented plan area m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceFlatIceMeltMDay, "referenceFlatIceMeltMDay");
  positive(input.representedPlanAreaM2, "representedPlanAreaM2");
  nonnegative(input.cliffNormalBackwastingMDay, "cliffNormalBackwastingMDay");
  nonnegative(input.cliffFaceAreaM2, "cliffFaceAreaM2");
  const E = input.cliffNormalBackwastingMDay / input.referenceFlatIceMeltMDay;
  return {
    observedNormalBackwastingEnhancement: E,
    planAreaEquivalentEnhancement:
      E * (input.cliffFaceAreaM2 / input.representedPlanAreaM2),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cliffNormalBackwastingMDay: 0.04,
  referenceFlatIceMeltMDay: 0.01,
  cliffFaceAreaM2: 10,
  representedPlanAreaM2: 20,
} satisfies Input;
export const exampleOutput = {
  observedNormalBackwastingEnhancement: 4,
  planAreaEquivalentEnhancement: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/ice-cliff-backwasting-enhancement",
  title: "Ice Cliff Backwasting Enhancement Calculator",
  description:
    "Calibrate actual cliff backwasting enhancement and distinguish normal-face from represented plan-area convention; not universal debris enhancement or predicting melt rate from aspect alone.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedNormalBackwastingEnhancement",
      label: "Observed normal backwasting enhancement",
      kind: "number",
    },
    {
      id: "planAreaEquivalentEnhancement",
      label: "Plan area equivalent enhancement",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cliffNormalBackwastingMDay: value.cliffNormalBackwastingMDay as number,
      referenceFlatIceMeltMDay: value.referenceFlatIceMeltMDay as number,
      cliffFaceAreaM2: value.cliffFaceAreaM2 as number,
      representedPlanAreaM2: value.representedPlanAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
