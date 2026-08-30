import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly outerBandWidthsMicrometers: readonly number[];
  readonly outerBandVascularPorosities: readonly number[];
  readonly callerMaximumBandWidthMicrometers: number;
  readonly callerMaximumOuterPorosity: number;
  readonly callerMinimumQualifyingConsecutiveBands: number;
}>;
export type Output = Readonly<{
  readonly qualifyingOuterBandFlags: readonly number[];
  readonly outermostQualifyingBandRun: number;
  readonly callerEfsMorphologyCriterionObserved: boolean;
}>;
const inputFields = [
  {
    id: "outerBandWidthsMicrometers",
    label: "Outer band widths micrometers",
    kind: "numberList",
  },
  {
    id: "outerBandVascularPorosities",
    label: "Outer band vascular porosities",
    kind: "numberList",
  },
  {
    id: "callerMaximumBandWidthMicrometers",
    label: "Caller maximum band width micrometers",
    kind: "number",
  },
  {
    id: "callerMaximumOuterPorosity",
    label: "Caller maximum outer porosity",
    kind: "number",
  },
  {
    id: "callerMinimumQualifyingConsecutiveBands",
    label: "Caller minimum qualifying consecutive bands",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMinimumQualifyingConsecutiveBands,
    "callerMinimumQualifyingConsecutiveBands",
  );
  input.outerBandWidthsMicrometers.forEach((v) =>
    nonnegative(v, "outerBandWidthsMicrometers"),
  );
  nonnegative(
    input.callerMaximumBandWidthMicrometers,
    "callerMaximumBandWidthMicrometers",
  );
  input.outerBandVascularPorosities.forEach((v) =>
    fraction(v, "outerBandVascularPorosities"),
  );
  fraction(input.callerMaximumOuterPorosity, "callerMaximumOuterPorosity");
  count(
    input.callerMinimumQualifyingConsecutiveBands,
    "callerMinimumQualifyingConsecutiveBands",
  );
  aligned(
    input.outerBandWidthsMicrometers,
    input.outerBandVascularPorosities,
    "outerBandWidthsMicrometers",
  );
  const qualifyingOuterBandFlags = input.outerBandWidthsMicrometers.map(
    (v, i) =>
      v <= input.callerMaximumBandWidthMicrometers &&
      input.outerBandVascularPorosities[i] <= input.callerMaximumOuterPorosity
        ? 1
        : 0,
  );
  let run = 0;
  for (
    let i = qualifyingOuterBandFlags.length - 1;
    i >= 0 && qualifyingOuterBandFlags[i] === 1;
    i--
  )
    run++;
  return {
    qualifyingOuterBandFlags,
    outermostQualifyingBandRun: run,
    callerEfsMorphologyCriterionObserved:
      run >= input.callerMinimumQualifyingConsecutiveBands,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  outerBandWidthsMicrometers: [5, 4, 3],
  outerBandVascularPorosities: [0.01, 0.02, 0.01],
  callerMaximumBandWidthMicrometers: 5,
  callerMaximumOuterPorosity: 0.02,
  callerMinimumQualifyingConsecutiveBands: 3,
} satisfies Input;
export const exampleOutput = {
  qualifyingOuterBandFlags: [1, 1, 1],
  outermostQualifyingBandRun: 3,
  callerEfsMorphologyCriterionObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/efs-maturity-flag",
  title: "External Fundamental System EFS Maturity Flag",
  description:
    "Screen supplied inner-to-outer band widths/vascularity for a caller EFS-like outer run; independently assessed histology and taxonomic context remain necessary, not a maturity diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "qualifyingOuterBandFlags",
      label: "Qualifying outer band flags",
      kind: "numberList",
    },
    {
      id: "outermostQualifyingBandRun",
      label: "Outermost qualifying band run",
      kind: "number",
    },
    {
      id: "callerEfsMorphologyCriterionObserved",
      label: "Caller efs morphology criterion observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      outerBandWidthsMicrometers:
        value.outerBandWidthsMicrometers as readonly number[],
      outerBandVascularPorosities:
        value.outerBandVascularPorosities as readonly number[],
      callerMaximumBandWidthMicrometers:
        value.callerMaximumBandWidthMicrometers as number,
      callerMaximumOuterPorosity: value.callerMaximumOuterPorosity as number,
      callerMinimumQualifyingConsecutiveBands:
        value.callerMinimumQualifyingConsecutiveBands as number,
    }),
});
export const run = tool.execute;
export default tool;
