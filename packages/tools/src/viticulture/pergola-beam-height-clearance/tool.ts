import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly measuredBeamUndersideHeightsM: readonly number[];
  readonly hangingFoliageDepthsM: readonly number[];
  readonly callerRequiredPassageHeightsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedClearanceHeightsM: readonly number[];
  readonly signedClearanceMarginsM: readonly number[];
  readonly belowCallerPassageHeightFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredBeamUndersideHeightsM",
    label: "Measured beam underside heights m",
    kind: "numberList",
  },
  {
    id: "hangingFoliageDepthsM",
    label: "Hanging foliage depths m",
    kind: "numberList",
  },
  {
    id: "callerRequiredPassageHeightsM",
    label: "Caller required passage heights m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredBeamUndersideHeightsM.forEach((v) =>
    nonnegative(v, "measuredBeamUndersideHeightsM"),
  );
  input.hangingFoliageDepthsM.forEach((v) =>
    nonnegative(v, "hangingFoliageDepthsM"),
  );
  input.callerRequiredPassageHeightsM.forEach((v) =>
    nonnegative(v, "callerRequiredPassageHeightsM"),
  );
  aligned(
    input.measuredBeamUndersideHeightsM,
    input.hangingFoliageDepthsM,
    "measuredBeamUndersideHeightsM",
  );
  aligned(
    input.measuredBeamUndersideHeightsM,
    input.callerRequiredPassageHeightsM,
    "measuredBeamUndersideHeightsM",
  );
  const observedClearanceHeightsM = input.measuredBeamUndersideHeightsM.map(
      (h, i) => nonnegative(h - input.hangingFoliageDepthsM[i], "hangingDepth"),
    ),
    signedClearanceMarginsM = observedClearanceHeightsM.map(
      (h, i) => h - input.callerRequiredPassageHeightsM[i],
    );
  return {
    observedClearanceHeightsM,
    signedClearanceMarginsM,
    belowCallerPassageHeightFlags: signedClearanceMarginsM.map((v) =>
      v < 0 ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredBeamUndersideHeightsM: [2, 2.5],
  hangingFoliageDepthsM: [0.2, 0.5],
  callerRequiredPassageHeightsM: [1.9, 1.8],
} satisfies Input;
export const exampleOutput = {
  observedClearanceHeightsM: [1.8, 2],
  signedClearanceMarginsM: [-0.1, 0.2],
  belowCallerPassageHeightFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/pergola-beam-height-clearance",
  title: "Pergola Beam Height Clearance",
  description:
    "Audit measured pergola underside minus hanging canopy against caller passage-envelope height, retaining signed margins; no load-bearing, accessibility or worker/equipment safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedClearanceHeightsM",
      label: "Observed clearance heights m",
      kind: "numberList",
    },
    {
      id: "signedClearanceMarginsM",
      label: "Signed clearance margins m",
      kind: "numberList",
    },
    {
      id: "belowCallerPassageHeightFlags",
      label: "Below caller passage height flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredBeamUndersideHeightsM:
        value.measuredBeamUndersideHeightsM as readonly number[],
      hangingFoliageDepthsM: value.hangingFoliageDepthsM as readonly number[],
      callerRequiredPassageHeightsM:
        value.callerRequiredPassageHeightsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
