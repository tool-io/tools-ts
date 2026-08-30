import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly measuredRindMicrometers: number;
  readonly inheritedRindMicrometers: number;
  readonly hydrationSquaredMicrometersPerYear: number;
}>;
export type Output = Readonly<{ readonly hydrationAgeScenarioYears: number }>;
const inputFields = [
  {
    id: "measuredRindMicrometers",
    label: "Measured rind micrometers",
    kind: "number",
  },
  {
    id: "inheritedRindMicrometers",
    label: "Inherited rind micrometers",
    kind: "number",
  },
  {
    id: "hydrationSquaredMicrometersPerYear",
    label: "Hydration squared micrometers per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.hydrationSquaredMicrometersPerYear,
    "hydrationSquaredMicrometersPerYear",
  );
  nonnegative(input.measuredRindMicrometers, "measuredRindMicrometers");
  nonnegative(input.inheritedRindMicrometers, "inheritedRindMicrometers");
  if (input.inheritedRindMicrometers > input.measuredRindMicrometers)
    simpleError(
      "inheritedRindMicrometers",
      "Inherited rind cannot exceed observed rind.",
    );
  return {
    hydrationAgeScenarioYears:
      ((input.measuredRindMicrometers - input.inheritedRindMicrometers) *
        (input.measuredRindMicrometers + input.inheritedRindMicrometers)) /
      input.hydrationSquaredMicrometersPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredRindMicrometers: 3,
  inheritedRindMicrometers: 1,
  hydrationSquaredMicrometersPerYear: 2,
} satisfies Input;
export const exampleOutput = { hydrationAgeScenarioYears: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/obsidian-hydration-rind-age",
  title: "Obsidian Hydration Rind Age",
  description:
    "Evaluate a caller calibrated squared-rind hydration age subtracting inherited squared growth, not rind width linearly; effective hydration rate is environment/composition-specific.",
  inputs: inputFields,
  outputs: [
    {
      id: "hydrationAgeScenarioYears",
      label: "Hydration age scenario years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredRindMicrometers: value.measuredRindMicrometers as number,
      inheritedRindMicrometers: value.inheritedRindMicrometers as number,
      hydrationSquaredMicrometersPerYear:
        value.hydrationSquaredMicrometersPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
