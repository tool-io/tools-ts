import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredPearlDiametersMm: readonly number[];
  readonly diameterHalfUncertaintyMm: number;
  readonly callerSieveLowerEdgesMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly centralPearlSieveCodes: readonly number[];
  readonly minimumCompatibleSieveCodes: readonly number[];
  readonly maximumCompatibleSieveCodes: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredPearlDiametersMm",
    label: "Measured pearl diameters mm",
    kind: "numberList",
  },
  {
    id: "diameterHalfUncertaintyMm",
    label: "Diameter half uncertainty mm",
    kind: "number",
  },
  {
    id: "callerSieveLowerEdgesMm",
    label: "Caller sieve lower edges mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredPearlDiametersMm.forEach((v) =>
    positive(v, "measuredPearlDiametersMm"),
  );
  nonnegative(input.diameterHalfUncertaintyMm, "diameterHalfUncertaintyMm");
  const lo = input.measuredPearlDiametersMm.map((v) =>
    nonnegative(v - input.diameterHalfUncertaintyMm, "diameterBounds"),
  );
  return {
    centralPearlSieveCodes: input.measuredPearlDiametersMm.map((v) =>
      bands(input.callerSieveLowerEdgesMm, v),
    ),
    minimumCompatibleSieveCodes: lo.map((v) =>
      bands(input.callerSieveLowerEdgesMm, v),
    ),
    maximumCompatibleSieveCodes: input.measuredPearlDiametersMm.map((v) =>
      bands(input.callerSieveLowerEdgesMm, v + input.diameterHalfUncertaintyMm),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredPearlDiametersMm: [7.9, 8.1],
  diameterHalfUncertaintyMm: 0.2,
  callerSieveLowerEdgesMm: [0, 8, 10],
} satisfies Input;
export const exampleOutput = {
  centralPearlSieveCodes: [0, 1],
  minimumCompatibleSieveCodes: [0, 0],
  maximumCompatibleSieveCodes: [1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/pearl-size-classifier",
  title: "Pearl Size Millimeter Sieve Classifier",
  description:
    "Classify measured pearl diameter with caller sieve bands and boundary uncertainty, preserving multiple possible sizes; no invented exact size at ambiguous screen boundary.",
  inputs: inputFields,
  outputs: [
    {
      id: "centralPearlSieveCodes",
      label: "Central pearl sieve codes",
      kind: "numberList",
    },
    {
      id: "minimumCompatibleSieveCodes",
      label: "Minimum compatible sieve codes",
      kind: "numberList",
    },
    {
      id: "maximumCompatibleSieveCodes",
      label: "Maximum compatible sieve codes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredPearlDiametersMm:
        value.measuredPearlDiametersMm as readonly number[],
      diameterHalfUncertaintyMm: value.diameterHalfUncertaintyMm as number,
      callerSieveLowerEdgesMm:
        value.callerSieveLowerEdgesMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
