import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedDirectionalIndices: readonly number[];
  readonly callerIndexResolution: number;
}>;
export type Output = Readonly<{
  readonly observedIndexSpread: number;
  readonly spreadMinusResolution: number;
  readonly anisotropyResolvedAboveCallerResolution: boolean;
}>;
const inputFields = [
  {
    id: "observedDirectionalIndices",
    label: "Observed directional indices",
    kind: "numberList",
  },
  {
    id: "callerIndexResolution",
    label: "Caller index resolution",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDirectionalIndices.forEach((v) =>
    positive(v, "observedDirectionalIndices"),
  );
  nonnegative(input.callerIndexResolution, "callerIndexResolution");
  const observedIndexSpread =
    maximum(input.observedDirectionalIndices) -
    minimum(input.observedDirectionalIndices);
  return {
    observedIndexSpread,
    spreadMinusResolution: observedIndexSpread - input.callerIndexResolution,
    anisotropyResolvedAboveCallerResolution:
      observedIndexSpread > input.callerIndexResolution,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDirectionalIndices: [1.5, 1.6, 1.55],
  callerIndexResolution: 0.01,
} satisfies Input;
export const exampleOutput = {
  observedIndexSpread: 0.1,
  spreadMinusResolution: 0.09,
  anisotropyResolvedAboveCallerResolution: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/birefringence-delta-ri",
  title: "Birefringence Delta RI",
  description:
    "Audit observed directional RI spread against caller resolution, not an inferred complete principal-index birefringence or mineral diagnostic; unobserved directions may hide larger spread.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIndexSpread",
      label: "Observed index spread",
      kind: "number",
    },
    {
      id: "spreadMinusResolution",
      label: "Spread minus resolution",
      kind: "number",
    },
    {
      id: "anisotropyResolvedAboveCallerResolution",
      label: "Anisotropy resolved above caller resolution",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDirectionalIndices:
        value.observedDirectionalIndices as readonly number[],
      callerIndexResolution: value.callerIndexResolution as number,
    }),
});
export const run = tool.execute;
export default tool;
