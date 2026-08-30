import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly stationPlanAreasM2: readonly number[];
  readonly excavatedThicknessesM: readonly number[];
  readonly obstructionVolumeM3: number;
}>;
export type Output = Readonly<{
  readonly grossSpitVolumeM3: number;
  readonly netExcavatedVolumeM3: number;
}>;
const inputFields = [
  {
    id: "stationPlanAreasM2",
    label: "Station plan areas m2",
    kind: "numberList",
  },
  {
    id: "excavatedThicknessesM",
    label: "Excavated thicknesses m",
    kind: "numberList",
  },
  { id: "obstructionVolumeM3", label: "Obstruction volume m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stationPlanAreasM2.forEach((v) => nonnegative(v, "stationPlanAreasM2"));
  input.excavatedThicknessesM.forEach((v) =>
    nonnegative(v, "excavatedThicknessesM"),
  );
  nonnegative(input.obstructionVolumeM3, "obstructionVolumeM3");
  aligned(
    input.stationPlanAreasM2,
    input.excavatedThicknessesM,
    "stationPlanAreasM2",
  );
  const grossSpitVolumeM3 = input.stationPlanAreasM2.reduce(
    (s, a, i) => s + a * input.excavatedThicknessesM[i],
    0,
  );
  return {
    grossSpitVolumeM3,
    netExcavatedVolumeM3: nonnegative(
      grossSpitVolumeM3 - input.obstructionVolumeM3,
      "obstructionVolumeM3",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stationPlanAreasM2: [1, 2],
  excavatedThicknessesM: [0.1, 0.2],
  obstructionVolumeM3: 0.05,
} satisfies Input;
export const exampleOutput = {
  grossSpitVolumeM3: 0.5,
  netExcavatedVolumeM3: 0.45,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/spit-volume-excavation",
  title: "Excavation Spit Volume",
  description:
    "Sum distinct plan-area/thickness excavation cells and subtract independently measured obstructions; not a uniform rectangular box alias or loose-spoil volume.",
  inputs: inputFields,
  outputs: [
    { id: "grossSpitVolumeM3", label: "Gross spit volume m3", kind: "number" },
    {
      id: "netExcavatedVolumeM3",
      label: "Net excavated volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stationPlanAreasM2: value.stationPlanAreasM2 as readonly number[],
      excavatedThicknessesM: value.excavatedThicknessesM as readonly number[],
      obstructionVolumeM3: value.obstructionVolumeM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
