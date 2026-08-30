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
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly cocoonFilamentLengthsM: readonly number[];
  readonly continuouslyReeledLengthsM: readonly number[];
  readonly unreelableCocoonFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly lengthWeightedReelabilityPercent: number;
  readonly cocoonCountReelabilityPercent: number;
}>;
const inputFields = [
  {
    id: "cocoonFilamentLengthsM",
    label: "Cocoon filament lengths m",
    kind: "numberList",
  },
  {
    id: "continuouslyReeledLengthsM",
    label: "Continuously reeled lengths m",
    kind: "numberList",
  },
  {
    id: "unreelableCocoonFlags",
    label: "Unreelable cocoon flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cocoonFilamentLengthsM.forEach((v) =>
    positive(v, "cocoonFilamentLengthsM"),
  );
  input.continuouslyReeledLengthsM.forEach((v) =>
    nonnegative(v, "continuouslyReeledLengthsM"),
  );
  aligned(
    input.cocoonFilamentLengthsM,
    input.continuouslyReeledLengthsM,
    "cocoonFilamentLengthsM",
  );
  aligned(
    input.cocoonFilamentLengthsM,
    input.unreelableCocoonFlags,
    "cocoonFilamentLengthsM",
  );
  if (
    input.unreelableCocoonFlags.some((v) => v !== 0 && v !== 1) ||
    input.continuouslyReeledLengthsM.some(
      (v, i) => v > input.cocoonFilamentLengthsM[i],
    )
  )
    simpleError(
      "continuouslyReeledLengthsM",
      "Reeled length ≤ available length and binary unreelable classification required.",
    );
  return {
    lengthWeightedReelabilityPercent:
      (100 * input.continuouslyReeledLengthsM.reduce((a, b) => a + b, 0)) /
      input.cocoonFilamentLengthsM.reduce((a, b) => a + b, 0),
    cocoonCountReelabilityPercent:
      100 * (1 - mean(input.unreelableCocoonFlags)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cocoonFilamentLengthsM: [100, 200],
  continuouslyReeledLengthsM: [80, 100],
  unreelableCocoonFlags: [0, 1],
} satisfies Input;
export const exampleOutput = {
  lengthWeightedReelabilityPercent: 60,
  cocoonCountReelabilityPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/reelability-percent-calculator",
  title: "Reelability Percent",
  description:
    "Report distinct length-weighted continuous reelability and count-based caller classifications; partial reeling is allowed even for a cocoon classified unreelable by the caller method.",
  inputs: inputFields,
  outputs: [
    {
      id: "lengthWeightedReelabilityPercent",
      label: "Length weighted reelability percent",
      kind: "number",
    },
    {
      id: "cocoonCountReelabilityPercent",
      label: "Cocoon count reelability percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cocoonFilamentLengthsM: value.cocoonFilamentLengthsM as readonly number[],
      continuouslyReeledLengthsM:
        value.continuouslyReeledLengthsM as readonly number[],
      unreelableCocoonFlags: value.unreelableCocoonFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
