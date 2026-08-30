import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly initialGaugeLengthsMm: readonly number[];
  readonly measuredCrossheadTravelMm: readonly number[];
  readonly machineComplianceMmPerNewton: number;
  readonly breakingForcesNewtons: readonly number[];
}>;
export type Output = Readonly<{
  readonly complianceCorrectedElongationPercents: readonly number[];
  readonly meanElongationPercent: number;
}>;
const inputFields = [
  {
    id: "initialGaugeLengthsMm",
    label: "Initial gauge lengths mm",
    kind: "numberList",
  },
  {
    id: "measuredCrossheadTravelMm",
    label: "Measured crosshead travel mm",
    kind: "numberList",
  },
  {
    id: "machineComplianceMmPerNewton",
    label: "Machine compliance mm per newton",
    kind: "number",
  },
  {
    id: "breakingForcesNewtons",
    label: "Breaking forces newtons",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.initialGaugeLengthsMm.forEach((v) =>
    positive(v, "initialGaugeLengthsMm"),
  );
  input.measuredCrossheadTravelMm.forEach((v) =>
    nonnegative(v, "measuredCrossheadTravelMm"),
  );
  nonnegative(
    input.machineComplianceMmPerNewton,
    "machineComplianceMmPerNewton",
  );
  input.breakingForcesNewtons.forEach((v) =>
    nonnegative(v, "breakingForcesNewtons"),
  );
  aligned(
    input.initialGaugeLengthsMm,
    input.measuredCrossheadTravelMm,
    "initialGaugeLengthsMm",
  );
  aligned(
    input.initialGaugeLengthsMm,
    input.breakingForcesNewtons,
    "initialGaugeLengthsMm",
  );
  const complianceCorrectedElongationPercents =
    input.measuredCrossheadTravelMm.map(
      (v, i) =>
        (100 *
          nonnegative(
            v -
              input.machineComplianceMmPerNewton *
                input.breakingForcesNewtons[i],
            "measuredCrossheadTravelMm",
          )) /
        input.initialGaugeLengthsMm[i],
    );
  return {
    complianceCorrectedElongationPercents,
    meanElongationPercent: mean(complianceCorrectedElongationPercents),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialGaugeLengthsMm: [100, 100],
  measuredCrossheadTravelMm: [10, 20],
  machineComplianceMmPerNewton: 1,
  breakingForcesNewtons: [2, 4],
} satisfies Input;
export const exampleOutput = {
  complianceCorrectedElongationPercents: [8, 16],
  meanElongationPercent: 12,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/elongation-percent-at-break",
  title: "Elongation Percent At Break",
  description:
    "Calculate matched yarn elongation at break after supplied machine-compliance correction; crosshead travel must already exclude seating/slip not represented by the compliance model.",
  inputs: inputFields,
  outputs: [
    {
      id: "complianceCorrectedElongationPercents",
      label: "Compliance corrected elongation percents",
      kind: "numberList",
    },
    {
      id: "meanElongationPercent",
      label: "Mean elongation percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialGaugeLengthsMm: value.initialGaugeLengthsMm as readonly number[],
      measuredCrossheadTravelMm:
        value.measuredCrossheadTravelMm as readonly number[],
      machineComplianceMmPerNewton:
        value.machineComplianceMmPerNewton as number,
      breakingForcesNewtons: value.breakingForcesNewtons as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
