import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sliceProfile } from "../shared.js";

export type Input = Readonly<{
  readonly heightsM: readonly number[];
  readonly eastWindMPerSecond: readonly number[];
  readonly northWindMPerSecond: readonly number[];
  readonly stormMotionEastMPerSecond: number;
  readonly stormMotionNorthMPerSecond: number;
  readonly layerBottomM: number;
  readonly layerTopM: number;
}>;
export type Output = Readonly<{
  readonly discreteStormRelativeHelicityM2PerSecond2: number;
}>;
const inputFields = [
  { id: "heightsM", label: "Heights m", kind: "numberList" },
  {
    id: "eastWindMPerSecond",
    label: "East wind m per second",
    kind: "numberList",
  },
  {
    id: "northWindMPerSecond",
    label: "North wind m per second",
    kind: "numberList",
  },
  {
    id: "stormMotionEastMPerSecond",
    label: "Storm motion east m per second",
    kind: "number",
  },
  {
    id: "stormMotionNorthMPerSecond",
    label: "Storm motion north m per second",
    kind: "number",
  },
  { id: "layerBottomM", label: "Layer bottom m", kind: "number" },
  { id: "layerTopM", label: "Layer top m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const u = sliceProfile(
      input.heightsM,
      input.eastWindMPerSecond,
      input.layerBottomM,
      input.layerTopM,
    ).y,
    v = sliceProfile(
      input.heightsM,
      input.northWindMPerSecond,
      input.layerBottomM,
      input.layerTopM,
    ).y;
  let srh = 0;
  for (let i = 1; i < u.length; i++)
    srh +=
      (u[i] - input.stormMotionEastMPerSecond) *
        (v[i - 1] - input.stormMotionNorthMPerSecond) -
      (u[i - 1] - input.stormMotionEastMPerSecond) *
        (v[i] - input.stormMotionNorthMPerSecond);
  return { discreteStormRelativeHelicityM2PerSecond2: srh };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  heightsM: [0, 1000],
  eastWindMPerSecond: [0, 10],
  northWindMPerSecond: [10, 0],
  stormMotionEastMPerSecond: 0,
  stormMotionNorthMPerSecond: 0,
  layerBottomM: 0,
  layerTopM: 1000,
} satisfies Input;
export const exampleOutput = {
  discreteStormRelativeHelicityM2PerSecond2: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/storm-relative-helicity-srh",
  title: "Storm Relative Helicity SRH",
  description:
    "Integrate signed storm-relative hodograph helicity over bounded observed layer using piecewise-linear winds and supplied storm motion; clockwise turns use positive conventional SRH, not tornado probability.",
  inputs: inputFields,
  outputs: [
    {
      id: "discreteStormRelativeHelicityM2PerSecond2",
      label: "Discrete storm relative helicity m2 per second2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      heightsM: value.heightsM as readonly number[],
      eastWindMPerSecond: value.eastWindMPerSecond as readonly number[],
      northWindMPerSecond: value.northWindMPerSecond as readonly number[],
      stormMotionEastMPerSecond: value.stormMotionEastMPerSecond as number,
      stormMotionNorthMPerSecond: value.stormMotionNorthMPerSecond as number,
      layerBottomM: value.layerBottomM as number,
      layerTopM: value.layerTopM as number,
    }),
});
export const run = tool.execute;
export default tool;
