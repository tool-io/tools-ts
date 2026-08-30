import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sliceProfile } from "../shared.js";

export type Input = Readonly<{
  readonly heightsM: readonly number[];
  readonly suppliedBuoyancyMPerSecond2: readonly number[];
  readonly searchAboveLfcHeightM: number;
}>;
export type Output = Readonly<{
  readonly observedEquilibriumLevelFound: boolean;
  readonly observedEquilibriumLevelHeightM: number;
  readonly positiveLayerRightCensored: boolean;
}>;
const inputFields = [
  { id: "heightsM", label: "Heights m", kind: "numberList" },
  {
    id: "suppliedBuoyancyMPerSecond2",
    label: "Supplied buoyancy m per second2",
    kind: "numberList",
  },
  {
    id: "searchAboveLfcHeightM",
    label: "Search above lfc height m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = sliceProfile(
    input.heightsM,
    input.suppliedBuoyancyMPerSecond2,
    input.searchAboveLfcHeightM,
    input.heightsM.at(-1)!,
  );
  let positiveSeen = p.y[0] > 0;
  for (let i = 1; i < p.z.length; i++) {
    if (positiveSeen && p.y[i - 1] > 0 && p.y[i] <= 0)
      return {
        observedEquilibriumLevelFound: true,
        observedEquilibriumLevelHeightM:
          p.z[i - 1] +
          ((p.z[i] - p.z[i - 1]) * p.y[i - 1]) / (p.y[i - 1] - p.y[i]),
        positiveLayerRightCensored: false,
      };
    if (p.y[i] > 0) positiveSeen = true;
  }
  return {
    observedEquilibriumLevelFound: false,
    observedEquilibriumLevelHeightM: -1,
    positiveLayerRightCensored: positiveSeen,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  heightsM: [0, 1000, 2000],
  suppliedBuoyancyMPerSecond2: [0, 1, -1],
  searchAboveLfcHeightM: 0,
} satisfies Input;
export const exampleOutput = {
  observedEquilibriumLevelFound: true,
  observedEquilibriumLevelHeightM: 1500,
  positiveLayerRightCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/el-equilibrium-level",
  title: "EL Equilibrium Level",
  description:
    "Locate first upper zero crossing terminating observed positive-buoyancy layer after caller LFC search boundary; retain unobserved EL/right-censored positive layer rather than extrapolating sounding top.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedEquilibriumLevelFound",
      label: "Observed equilibrium level found",
      kind: "boolean",
    },
    {
      id: "observedEquilibriumLevelHeightM",
      label: "Observed equilibrium level height m",
      kind: "number",
    },
    {
      id: "positiveLayerRightCensored",
      label: "Positive layer right censored",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      heightsM: value.heightsM as readonly number[],
      suppliedBuoyancyMPerSecond2:
        value.suppliedBuoyancyMPerSecond2 as readonly number[],
      searchAboveLfcHeightM: value.searchAboveLfcHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
