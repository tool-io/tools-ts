import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  criterionTable,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualWidthMeters: number;
  readonly actualHeightMeters: number;
  readonly callerApplicableBandLowerAspectRatios: readonly number[];
  readonly callerApplicableBandUpperAspectRatios: readonly number[];
  readonly callerBandNames: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualWidthMeters", label: "Actual width meters", kind: "number" },
  { id: "actualHeightMeters", label: "Actual height meters", kind: "number" },
  {
    id: "callerApplicableBandLowerAspectRatios",
    label: "Caller applicable band lower aspect ratios",
    kind: "numberList",
  },
  {
    id: "callerApplicableBandUpperAspectRatios",
    label: "Caller applicable band upper aspect ratios",
    kind: "numberList",
  },
  { id: "callerBandNames", label: "Caller band names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualWidthMeters, "width");
  positive(input.actualHeightMeters, "height");
  const r = input.actualWidthMeters / input.actualHeightMeters;
  return {
    observedWidthHeightRatio: r,
    matchedCallerAspectClasses: criterionTable(
      r,
      input.callerApplicableBandLowerAspectRatios,
      input.callerApplicableBandUpperAspectRatios,
      input.callerBandNames,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualWidthMeters: 2,
    actualHeightMeters: 4,
    callerApplicableBandLowerAspectRatios: [0, 1],
    callerApplicableBandUpperAspectRatios: [1, 10],
    callerBandNames: ["tall", "broad"],
  },
  output: {
    result: {
      observedWidthHeightRatio: 0.5,
      matchedCallerAspectClasses: ["tall"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/width-height-aspect-classifier",
  title: "Passage Width-to-Height Aspect Classifier",
  description:
    "Actual width/height ratio classified by independently applicable half-open caller bands, overlaps retained; no universal passage aspect categories.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
