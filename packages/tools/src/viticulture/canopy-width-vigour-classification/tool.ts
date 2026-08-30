import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredCanopyWidthsM: readonly number[];
  readonly representedRowLengthsM: readonly number[];
  readonly callerWidthClassLowerEdgesM: readonly number[];
}>;
export type Output = Readonly<{
  readonly lengthWeightedCanopyWidthM: number;
  readonly localCallerWidthClassCodes: readonly number[];
  readonly pooledCallerWidthClassCode: number;
}>;
const inputFields = [
  {
    id: "measuredCanopyWidthsM",
    label: "Measured canopy widths m",
    kind: "numberList",
  },
  {
    id: "representedRowLengthsM",
    label: "Represented row lengths m",
    kind: "numberList",
  },
  {
    id: "callerWidthClassLowerEdgesM",
    label: "Caller width class lower edges m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedRowLengthsM.forEach((v) =>
    positive(v, "representedRowLengthsM"),
  );
  input.measuredCanopyWidthsM.forEach((v) =>
    nonnegative(v, "measuredCanopyWidthsM"),
  );
  aligned(
    input.measuredCanopyWidthsM,
    input.representedRowLengthsM,
    "measuredCanopyWidthsM",
  );
  const total = input.representedRowLengthsM.reduce((a, b) => a + b, 0),
    lengthWeightedCanopyWidthM = input.measuredCanopyWidthsM.reduce(
      (s, v, i) => s + (v * input.representedRowLengthsM[i]) / total,
      0,
    );
  return {
    lengthWeightedCanopyWidthM,
    localCallerWidthClassCodes: input.measuredCanopyWidthsM.map((v) =>
      bands(input.callerWidthClassLowerEdgesM, v),
    ),
    pooledCallerWidthClassCode: bands(
      input.callerWidthClassLowerEdgesM,
      lengthWeightedCanopyWidthM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredCanopyWidthsM: [0.5, 1],
  representedRowLengthsM: [1, 3],
  callerWidthClassLowerEdgesM: [0, 0.6, 1.2],
} satisfies Input;
export const exampleOutput = {
  lengthWeightedCanopyWidthM: 0.875,
  localCallerWidthClassCodes: [0, 1],
  pooledCallerWidthClassCode: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/canopy-width-vigour-classification",
  title: "Canopy Width Vigour Classification Tool",
  description:
    "Audit physical canopy widths by represented row length against caller local/pooled width bands; width alone does not establish physiological vigor or treatment need.",
  inputs: inputFields,
  outputs: [
    {
      id: "lengthWeightedCanopyWidthM",
      label: "Length weighted canopy width m",
      kind: "number",
    },
    {
      id: "localCallerWidthClassCodes",
      label: "Local caller width class codes",
      kind: "numberList",
    },
    {
      id: "pooledCallerWidthClassCode",
      label: "Pooled caller width class code",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredCanopyWidthsM: value.measuredCanopyWidthsM as readonly number[],
      representedRowLengthsM: value.representedRowLengthsM as readonly number[],
      callerWidthClassLowerEdgesM:
        value.callerWidthClassLowerEdgesM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
