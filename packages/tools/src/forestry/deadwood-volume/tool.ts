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
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly logSegmentLengthsM: readonly number[];
  readonly outerEndDiametersM: readonly (readonly number[])[];
  readonly hollowEndDiametersM: readonly (readonly number[])[];
  readonly remainingSolidVolumeFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly grossEnvelopeVolumeM3: number;
  readonly hollowCorrectedSolidVolumeM3: number;
  readonly decayAdjustedRemainingSolidVolumeM3: number;
}>;
const inputFields = [
  {
    id: "logSegmentLengthsM",
    label: "Log segment lengths m",
    kind: "numberList",
  },
  { id: "outerEndDiametersM", label: "Outer end diameters m", kind: "matrix" },
  {
    id: "hollowEndDiametersM",
    label: "Hollow end diameters m",
    kind: "matrix",
  },
  {
    id: "remainingSolidVolumeFractions",
    label: "Remaining solid volume fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.logSegmentLengthsM.forEach((v) => nonnegative(v, "logSegmentLengthsM"));
  input.remainingSolidVolumeFractions.forEach((v) =>
    fraction(v, "remainingSolidVolumeFractions"),
  );
  aligned(
    input.logSegmentLengthsM,
    input.outerEndDiametersM,
    "logSegmentLengthsM",
  );
  aligned(
    input.logSegmentLengthsM,
    input.hollowEndDiametersM,
    "logSegmentLengthsM",
  );
  aligned(
    input.logSegmentLengthsM,
    input.remainingSolidVolumeFractions,
    "logSegmentLengthsM",
  );
  let gross = 0,
    solid = 0,
    remaining = 0;
  input.logSegmentLengthsM.forEach((l, i) => {
    const a = input.outerEndDiametersM[i],
      h = input.hollowEndDiametersM[i];
    if (
      a.length !== 2 ||
      h.length !== 2 ||
      a.some((v, j) => v < 0 || h[j] < 0 || h[j] > v)
    )
      simpleError(
        "diameters",
        "Two valid outer/hollow end diameters required per segment.",
      );
    const g = (Math.PI * l * (a[0] ** 2 + a[0] * a[1] + a[1] ** 2)) / 12,
      v = g - (Math.PI * l * (h[0] ** 2 + h[0] * h[1] + h[1] ** 2)) / 12;
    gross += g;
    solid += v;
    remaining += v * input.remainingSolidVolumeFractions[i];
  });
  return {
    grossEnvelopeVolumeM3: gross,
    hollowCorrectedSolidVolumeM3: solid,
    decayAdjustedRemainingSolidVolumeM3: remaining,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  logSegmentLengthsM: [1, 2],
  outerEndDiametersM: [
    [1, 1],
    [1, 1],
  ],
  hollowEndDiametersM: [
    [0.5, 0.5],
    [0, 0],
  ],
  remainingSolidVolumeFractions: [1, 0.5],
} satisfies Input;
export const exampleOutput = {
  grossEnvelopeVolumeM3: 2.356194490192345,
  hollowCorrectedSolidVolumeM3: 2.1598449493429825,
  decayAdjustedRemainingSolidVolumeM3: 1.3744467859455345,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/deadwood-volume",
  title: "Deadwood Volume",
  description:
    "Inventory exact frustum log envelopes, hollow exclusions and caller decay-adjusted solid volume separately; not a standalone Huber/Smalian/Newton or bark-volume alias, and cavity/taper assumptions are explicit.",
  inputs: inputFields,
  outputs: [
    {
      id: "grossEnvelopeVolumeM3",
      label: "Gross envelope volume m3",
      kind: "number",
    },
    {
      id: "hollowCorrectedSolidVolumeM3",
      label: "Hollow corrected solid volume m3",
      kind: "number",
    },
    {
      id: "decayAdjustedRemainingSolidVolumeM3",
      label: "Decay adjusted remaining solid volume m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      logSegmentLengthsM: value.logSegmentLengthsM as readonly number[],
      outerEndDiametersM:
        value.outerEndDiametersM as readonly (readonly number[])[],
      hollowEndDiametersM:
        value.hollowEndDiametersM as readonly (readonly number[])[],
      remainingSolidVolumeFractions:
        value.remainingSolidVolumeFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
