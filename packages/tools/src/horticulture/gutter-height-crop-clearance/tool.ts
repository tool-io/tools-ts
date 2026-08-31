import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedGutterUndersideHeightsM: readonly number[];
  readonly observedCropTopHeightsM: readonly number[];
  readonly callerReservedHeadroomM: number;
}>;
export type Output = Readonly<{
  readonly signedCropToGutterClearancesM: readonly number[];
  readonly stationsBelowCallerHeadroomIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedGutterUndersideHeightsM",
    label: "Observed gutter underside heights m",
    kind: "numberList",
  },
  {
    id: "observedCropTopHeightsM",
    label: "Observed crop top heights m",
    kind: "numberList",
  },
  {
    id: "callerReservedHeadroomM",
    label: "Caller reserved headroom m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGutterUndersideHeightsM.forEach((v) =>
    nonnegative(v, "observedGutterUndersideHeightsM"),
  );
  input.observedCropTopHeightsM.forEach((v) =>
    nonnegative(v, "observedCropTopHeightsM"),
  );
  nonnegative(input.callerReservedHeadroomM, "callerReservedHeadroomM");
  aligned(
    input.observedGutterUndersideHeightsM,
    input.observedCropTopHeightsM,
    "observedGutterUndersideHeightsM",
  );
  const d = input.observedGutterUndersideHeightsM.map(
    (v, i) => v - input.observedCropTopHeightsM[i],
  );
  return {
    signedCropToGutterClearancesM: d,
    stationsBelowCallerHeadroomIndices: d.flatMap((v, i) =>
      v < input.callerReservedHeadroomM ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGutterUndersideHeightsM: [3, 3],
  observedCropTopHeightsM: [2, 3.5],
  callerReservedHeadroomM: 0.5,
} satisfies Input;
export const exampleOutput = {
  signedCropToGutterClearancesM: [1, -0.5],
  stationsBelowCallerHeadroomIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/gutter-height-crop-clearance",
  title: "Gutter Height Crop Clearance Calculator",
  description:
    "Audit actual gutter underside/crop top stations with signed deficits and caller reserved growth headroom; not universal crop clearance or safe passage/structure certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedCropToGutterClearancesM",
      label: "Signed crop to gutter clearances m",
      kind: "numberList",
    },
    {
      id: "stationsBelowCallerHeadroomIndices",
      label: "Stations below caller headroom indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGutterUndersideHeightsM:
        value.observedGutterUndersideHeightsM as readonly number[],
      observedCropTopHeightsM:
        value.observedCropTopHeightsM as readonly number[],
      callerReservedHeadroomM: value.callerReservedHeadroomM as number,
    }),
});
export const run = tool.execute;
export default tool;
