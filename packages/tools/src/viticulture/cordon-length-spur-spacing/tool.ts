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
  aligned,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly cordonLengthsM: readonly number[];
  readonly retainedSpurCounts: readonly number[];
  readonly reservedEndLengthsM: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly endpointInclusiveSpurSpacingsM: readonly number[];
  readonly usableCordonLengthsM: readonly number[];
}>;
const inputFields = [
  { id: "cordonLengthsM", label: "Cordon lengths m", kind: "numberList" },
  {
    id: "retainedSpurCounts",
    label: "Retained spur counts",
    kind: "numberList",
  },
  {
    id: "reservedEndLengthsM",
    label: "Reserved end lengths m",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cordonLengthsM.forEach((v) => positive(v, "cordonLengthsM"));
  input.retainedSpurCounts.forEach((v) => positive(v, "retainedSpurCounts"));
  input.retainedSpurCounts.forEach((v) => count(v, "retainedSpurCounts"));
  aligned(input.cordonLengthsM, input.retainedSpurCounts, "cordonLengthsM");
  aligned(input.cordonLengthsM, input.reservedEndLengthsM, "cordonLengthsM");
  if (
    shape(input.reservedEndLengthsM, "ends") !== 2 ||
    input.retainedSpurCounts.some((v) => v < 2)
  )
    simpleError(
      "spurs",
      "At least two spur positions and two nonnegative end exclusions per cordon required.",
    );
  const usableCordonLengthsM = input.cordonLengthsM.map((l, i) => {
    input.reservedEndLengthsM[i].forEach((v) => nonnegative(v, "ends"));
    return positive(
      l - input.reservedEndLengthsM[i][0] - input.reservedEndLengthsM[i][1],
      "usableCordon",
    );
  });
  return {
    endpointInclusiveSpurSpacingsM: usableCordonLengthsM.map(
      (v, i) => v / (input.retainedSpurCounts[i] - 1),
    ),
    usableCordonLengthsM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cordonLengthsM: [1, 2],
  retainedSpurCounts: [3, 5],
  reservedEndLengthsM: [
    [0.1, 0.1],
    [0.2, 0.2],
  ],
} satisfies Input;
export const exampleOutput = {
  endpointInclusiveSpurSpacingsM: [0.4, 0.4],
  usableCordonLengthsM: [0.8, 1.6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/cordon-length-spur-spacing",
  title: "Cordon Length Spur Spacing",
  description:
    "Resolve equally spaced retained spur positions on measured cordons excluding ends, using N-1 intervals rather than N; no universal spur spacing, physical position optimization or vine-quality recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "endpointInclusiveSpurSpacingsM",
      label: "Endpoint inclusive spur spacings m",
      kind: "numberList",
    },
    {
      id: "usableCordonLengthsM",
      label: "Usable cordon lengths m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      cordonLengthsM: value.cordonLengthsM as readonly number[],
      retainedSpurCounts: value.retainedSpurCounts as readonly number[],
      reservedEndLengthsM:
        value.reservedEndLengthsM as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
