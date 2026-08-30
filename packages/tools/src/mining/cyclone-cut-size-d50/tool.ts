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
  fraction,
  aligned,
  ordered,
  interpolate,
} from "../shared.js";
export type Input = Readonly<{
  readonly sizeMicrometers: readonly number[];
  readonly underflowPartitionFractions: readonly number[];
  readonly waterBypassFraction: number;
}>;
export type Output = Readonly<{
  readonly correctedD50Micrometers: number;
  readonly correctedPartitionFractions: readonly number[];
}>;
const inputFields = [
  { id: "sizeMicrometers", label: "Size micrometers", kind: "numberList" },
  {
    id: "underflowPartitionFractions",
    label: "Underflow partition fractions",
    kind: "numberList",
  },
  { id: "waterBypassFraction", label: "Water bypass fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sizeMicrometers.forEach((v) => positive(v, "sizeMicrometers"));
  fraction(input.waterBypassFraction, "waterBypassFraction");
  input.underflowPartitionFractions.forEach((v) =>
    fraction(v, "underflowPartitionFractions"),
  );
  aligned(
    input.sizeMicrometers,
    input.underflowPartitionFractions,
    "sizeMicrometers",
  );
  ordered(input.sizeMicrometers, "sizeMicrometers");
  if (input.waterBypassFraction === 1)
    simpleError("waterBypassFraction", "Bypass below one required.");
  const correctedPartitionFractions = input.underflowPartitionFractions.map(
    (v) =>
      fraction(
        (v - input.waterBypassFraction) / (1 - input.waterBypassFraction),
        "correctedPartition",
      ),
  );
  ordered(correctedPartitionFractions, "correctedPartition");
  return {
    correctedD50Micrometers: interpolate(
      correctedPartitionFractions,
      input.sizeMicrometers,
      0.5,
    ),
    correctedPartitionFractions,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sizeMicrometers: [10, 20, 40],
  underflowPartitionFractions: [0.1, 0.5, 0.9],
  waterBypassFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  correctedD50Micrometers: 22.5,
  correctedPartitionFractions: [0, 0.4444444444444444, 0.8888888888888888],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/cyclone-cut-size-d50",
  title: "Cyclone Cut Size D50",
  description:
    "Remove supplied water bypass from measured increasing partition curve and linearly interpolate corrected d50 in size; no extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedD50Micrometers",
      label: "Corrected d50 micrometers",
      kind: "number",
    },
    {
      id: "correctedPartitionFractions",
      label: "Corrected partition fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sizeMicrometers: value.sizeMicrometers as readonly number[],
      underflowPartitionFractions:
        value.underflowPartitionFractions as readonly number[],
      waterBypassFraction: value.waterBypassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
