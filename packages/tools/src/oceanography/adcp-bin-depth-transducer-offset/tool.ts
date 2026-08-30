import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly transducerDepthM: number;
  readonly firstBinNearEdgeRangeM: number;
  readonly binWidthM: number;
  readonly binIndexes: readonly number[];
  readonly beamAngleFromVerticalDegrees: number;
  readonly downwardLooking: boolean;
  readonly bottomDepthM: number;
  readonly minimumBottomClearanceM: number;
}>;
export type Output = Readonly<{
  readonly binCenterDepthsM: readonly number[];
  readonly callerUsableBinFlags: readonly number[];
}>;
const inputFields = [
  { id: "transducerDepthM", label: "Transducer depth m", kind: "number" },
  {
    id: "firstBinNearEdgeRangeM",
    label: "First bin near edge range m",
    kind: "number",
  },
  { id: "binWidthM", label: "Bin width m", kind: "number" },
  { id: "binIndexes", label: "Bin indexes", kind: "numberList" },
  {
    id: "beamAngleFromVerticalDegrees",
    label: "Beam angle from vertical degrees",
    kind: "number",
  },
  { id: "downwardLooking", label: "Downward looking", kind: "boolean" },
  { id: "bottomDepthM", label: "Bottom depth m", kind: "number" },
  {
    id: "minimumBottomClearanceM",
    label: "Minimum bottom clearance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.binWidthM, "binWidthM");
  nonnegative(input.transducerDepthM, "transducerDepthM");
  nonnegative(input.firstBinNearEdgeRangeM, "firstBinNearEdgeRangeM");
  nonnegative(input.bottomDepthM, "bottomDepthM");
  nonnegative(input.minimumBottomClearanceM, "minimumBottomClearanceM");
  input.binIndexes.forEach((v) => count(v, "binIndexes"));
  if (
    input.beamAngleFromVerticalDegrees < 0 ||
    input.beamAngleFromVerticalDegrees >= 90 ||
    input.bottomDepthM < input.transducerDepthM
  )
    simpleError(
      "geometry",
      "Angle in [0,90) and transducer above bottom required.",
    );
  const c = Math.cos((input.beamAngleFromVerticalDegrees * Math.PI) / 180),
    binCenterDepthsM = input.binIndexes.map(
      (i) =>
        input.transducerDepthM +
        (input.downwardLooking ? 1 : -1) *
          (input.firstBinNearEdgeRangeM + (i + 0.5) * input.binWidthM) *
          c,
    );
  return {
    binCenterDepthsM,
    callerUsableBinFlags: binCenterDepthsM.map((d) =>
      d >= -8 * Number.EPSILON * input.bottomDepthM &&
      d <=
        input.bottomDepthM -
          input.minimumBottomClearanceM +
          8 * Number.EPSILON * input.bottomDepthM
        ? 1
        : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  transducerDepthM: 10,
  firstBinNearEdgeRangeM: 5,
  binWidthM: 2,
  binIndexes: [0, 1],
  beamAngleFromVerticalDegrees: 60,
  downwardLooking: true,
  bottomDepthM: 14,
  minimumBottomClearanceM: 1,
} satisfies Input;
export const exampleOutput = {
  binCenterDepthsM: [13, 14],
  callerUsableBinFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/adcp-bin-depth-transducer-offset",
  title: "ADCP Bin Depth Transducer Offset",
  description:
    "Compute ADCP beam-range bin centers on positive-down depths and caller bottom-clearance screen for a vertical instrument; side-lobe contamination and attitude corrections are not modeled.",
  inputs: inputFields,
  outputs: [
    {
      id: "binCenterDepthsM",
      label: "Bin center depths m",
      kind: "numberList",
    },
    {
      id: "callerUsableBinFlags",
      label: "Caller usable bin flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      transducerDepthM: value.transducerDepthM as number,
      firstBinNearEdgeRangeM: value.firstBinNearEdgeRangeM as number,
      binWidthM: value.binWidthM as number,
      binIndexes: value.binIndexes as readonly number[],
      beamAngleFromVerticalDegrees:
        value.beamAngleFromVerticalDegrees as number,
      downwardLooking: value.downwardLooking as boolean,
      bottomDepthM: value.bottomDepthM as number,
      minimumBottomClearanceM: value.minimumBottomClearanceM as number,
    }),
});
export const run = tool.execute;
export default tool;
