import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerReferenceCandyStageC: number;
  readonly callerReferenceWaterBoilingC: number;
  readonly observedLocalWaterBoilingC: number;
}>;
export type Output = Readonly<{
  readonly conditionalAdjustedCandyStageC: number;
}>;
const inputFields = [
  {
    id: "callerReferenceCandyStageC",
    label: "Caller reference candy stage c",
    kind: "number",
  },
  {
    id: "callerReferenceWaterBoilingC",
    label: "Caller reference water boiling c",
    kind: "number",
  },
  {
    id: "observedLocalWaterBoilingC",
    label: "Observed local water boiling c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.observedLocalWaterBoilingC <= 0 ||
    input.callerReferenceWaterBoilingC <= 0
  )
    simpleError(
      "boiling",
      "Positive independently measured/reference boiling points.",
    );
  return {
    conditionalAdjustedCandyStageC:
      input.callerReferenceCandyStageC +
      input.observedLocalWaterBoilingC -
      input.callerReferenceWaterBoilingC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReferenceCandyStageC: 150,
  callerReferenceWaterBoilingC: 100,
  observedLocalWaterBoilingC: 98,
} satisfies Input;
export const exampleOutput = {
  conditionalAdjustedCandyStageC: 148,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/candy-temperature-altitude-correction",
  title: "Cooking Candy Temperature Altitude Correction Calculator",
  description:
    "Candy stage offset by independently measured local/reference boiling-point difference; altitude/pressure not inferred or replaced with fixed lapse. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalAdjustedCandyStageC",
      label: "Conditional adjusted candy stage c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerReferenceCandyStageC: value.callerReferenceCandyStageC as number,
      callerReferenceWaterBoilingC:
        value.callerReferenceWaterBoilingC as number,
      observedLocalWaterBoilingC: value.observedLocalWaterBoilingC as number,
    }),
});
export const run = tool.execute;
export default tool;
