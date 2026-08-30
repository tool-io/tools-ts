import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sliceProfile } from "../shared.js";

export type Input = Readonly<{
  readonly heightsM: readonly number[];
  readonly suppliedBuoyancyMPerSecond2: readonly number[];
  readonly suppliedLclHeightM: number;
}>;
export type Output = Readonly<{
  readonly observedLfcFound: boolean;
  readonly observedLfcHeightM: number;
  readonly lfcLeftCensored: boolean;
}>;
const inputFields = [
  { id: "heightsM", label: "Heights m", kind: "numberList" },
  {
    id: "suppliedBuoyancyMPerSecond2",
    label: "Supplied buoyancy m per second2",
    kind: "numberList",
  },
  { id: "suppliedLclHeightM", label: "Supplied lcl height m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = sliceProfile(
    input.heightsM,
    input.suppliedBuoyancyMPerSecond2,
    input.suppliedLclHeightM,
    input.heightsM.at(-1)!,
  );
  if (p.y[0] > 0)
    return {
      observedLfcFound: true,
      observedLfcHeightM: p.z[0],
      lfcLeftCensored: true,
    };
  for (let i = 1; i < p.z.length; i++)
    if (p.y[i] > 0 && p.y[i - 1] <= 0)
      return {
        observedLfcFound: true,
        observedLfcHeightM:
          p.z[i - 1] +
          ((p.z[i] - p.z[i - 1]) * -p.y[i - 1]) / (p.y[i] - p.y[i - 1]),
        lfcLeftCensored: false,
      };
  return {
    observedLfcFound: false,
    observedLfcHeightM: -1,
    lfcLeftCensored: false,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  heightsM: [0, 1000, 2000],
  suppliedBuoyancyMPerSecond2: [-1, 0, 1],
  suppliedLclHeightM: 0,
} satisfies Input;
export const exampleOutput = {
  observedLfcFound: true,
  observedLfcHeightM: 1000,
  lfcLeftCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/lfc-level-free-convection",
  title: "LFC Level Free Convection",
  description:
    "Find first strict-positive buoyancy transition at/above caller LCL in supplied linear sounding, with left-censoring or explicit no-observed-LFC sentinel; touches without positive buoyancy are not free convection.",
  inputs: inputFields,
  outputs: [
    { id: "observedLfcFound", label: "Observed lfc found", kind: "boolean" },
    {
      id: "observedLfcHeightM",
      label: "Observed lfc height m",
      kind: "number",
    },
    { id: "lfcLeftCensored", label: "Lfc left censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      heightsM: value.heightsM as readonly number[],
      suppliedBuoyancyMPerSecond2:
        value.suppliedBuoyancyMPerSecond2 as readonly number[],
      suppliedLclHeightM: value.suppliedLclHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
