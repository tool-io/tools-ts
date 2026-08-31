import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, points } from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedNozzleLocalPositionsM: readonly (readonly number[])[];
  readonly callerMeasuredMatchedMistRadiusM: number;
  readonly callerMaximumSpacingToRadiusRatio: number;
}>;
export type Output = Readonly<{
  readonly observedConsecutiveNozzleSpacingsM: readonly number[];
  readonly signedConsecutiveOverlapDiametersM: readonly number[];
  readonly spacingPairsAboveCallerRatio: readonly number[];
}>;
const inputFields = [
  {
    id: "observedNozzleLocalPositionsM",
    label: "Observed nozzle local positions m",
    kind: "matrix",
  },
  {
    id: "callerMeasuredMatchedMistRadiusM",
    label: "Caller measured matched mist radius m",
    kind: "number",
  },
  {
    id: "callerMaximumSpacingToRadiusRatio",
    label: "Caller maximum spacing to radius ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMeasuredMatchedMistRadiusM,
    "callerMeasuredMatchedMistRadiusM",
  );
  positive(
    input.callerMaximumSpacingToRadiusRatio,
    "callerMaximumSpacingToRadiusRatio",
  );
  points(input.observedNozzleLocalPositionsM);
  if (input.observedNozzleLocalPositionsM.length < 2)
    simpleError("nozzles", "At least two actual nozzle stations required.");
  const gaps = input.observedNozzleLocalPositionsM
    .slice(1)
    .map((p, i) =>
      Math.hypot(
        p[0] - input.observedNozzleLocalPositionsM[i][0],
        p[1] - input.observedNozzleLocalPositionsM[i][1],
      ),
    );
  return {
    observedConsecutiveNozzleSpacingsM: gaps,
    signedConsecutiveOverlapDiametersM: gaps.map(
      (v) => 2 * input.callerMeasuredMatchedMistRadiusM - v,
    ),
    spacingPairsAboveCallerRatio: gaps.flatMap((v, i) =>
      v / input.callerMeasuredMatchedMistRadiusM >
      input.callerMaximumSpacingToRadiusRatio
        ? [i]
        : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNozzleLocalPositionsM: [
    [0, 0],
    [3, 0],
    [3, 4],
  ],
  callerMeasuredMatchedMistRadiusM: 2,
  callerMaximumSpacingToRadiusRatio: 2,
} satisfies Input;
export const exampleOutput = {
  observedConsecutiveNozzleSpacingsM: [3, 4],
  signedConsecutiveOverlapDiametersM: [1, 0],
  spacingPairsAboveCallerRatio: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/mist-nozzle-radius-spacing",
  title: "Mist Nozzle Radius Spacing Calculator",
  description:
    "Audit actual consecutive local nozzle center spacings against matched measured radius and caller spacing policy; center-line overlap not full 2D coverage/uniformity, no geodesy or spraying/disease-control recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedConsecutiveNozzleSpacingsM",
      label: "Observed consecutive nozzle spacings m",
      kind: "numberList",
    },
    {
      id: "signedConsecutiveOverlapDiametersM",
      label: "Signed consecutive overlap diameters m",
      kind: "numberList",
    },
    {
      id: "spacingPairsAboveCallerRatio",
      label: "Spacing pairs above caller ratio",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNozzleLocalPositionsM:
        value.observedNozzleLocalPositionsM as readonly (readonly number[])[],
      callerMeasuredMatchedMistRadiusM:
        value.callerMeasuredMatchedMistRadiusM as number,
      callerMaximumSpacingToRadiusRatio:
        value.callerMaximumSpacingToRadiusRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
