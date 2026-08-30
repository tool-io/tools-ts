import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly stagesM: readonly number[];
  readonly storageVolumesM3: readonly number[];
  readonly queryStagesM: readonly number[];
}>;
export type Output = Readonly<{
  readonly interpolatedStorageVolumesM3: readonly number[];
}>;
const inputFields = [
  { id: "stagesM", label: "Stages m", kind: "numberList" },
  { id: "storageVolumesM3", label: "Storage volumes m3", kind: "numberList" },
  { id: "queryStagesM", label: "Query stages m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.storageVolumesM3.forEach((v) => nonnegative(v, "storageVolumesM3"));
  ordered(input.stagesM, "stagesM");
  ordered(input.storageVolumesM3, "storageVolumesM3");
  aligned(input.stagesM, input.storageVolumesM3, "stagesM");
  if (
    !input.queryStagesM.length ||
    input.queryStagesM.length * input.stagesM.length > 1000000
  )
    simpleError(
      "queryStagesM",
      "Nonempty interpolation queries within the work budget required.",
    );
  return {
    interpolatedStorageVolumesM3: input.queryStagesM.map((z) =>
      interpolate(input.stagesM, input.storageVolumesM3, z),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stagesM: [0, 1, 2],
  storageVolumesM3: [0, 100, 300],
  queryStagesM: [0.5, 1.5],
} satisfies Input;
export const exampleOutput = {
  interpolatedStorageVolumesM3: [50, 200],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/stage-storage-volume-interpolation",
  title: "Stage Storage Volume Interpolation",
  description:
    "Interpolate storage for measured monotone stage/storage calibration within its observed bounds; no extrapolation, contour integration or invented lake geometry.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedStorageVolumesM3",
      label: "Interpolated storage volumes m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      stagesM: value.stagesM as readonly number[],
      storageVolumesM3: value.storageVolumesM3 as readonly number[],
      queryStagesM: value.queryStagesM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
