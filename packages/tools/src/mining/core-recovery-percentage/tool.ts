import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly runLengthsM: readonly number[];
  readonly recoveredCoreLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly runCoreRecoveriesPercent: readonly number[];
  readonly pooledCoreRecoveryPercent: number;
}>;
const inputFields = [
  { id: "runLengthsM", label: "Run lengths m", kind: "numberList" },
  {
    id: "recoveredCoreLengthsM",
    label: "Recovered core lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.runLengthsM.forEach((v) => positive(v, "runLengthsM"));
  input.recoveredCoreLengthsM.forEach((v) =>
    nonnegative(v, "recoveredCoreLengthsM"),
  );
  aligned(input.runLengthsM, input.recoveredCoreLengthsM, "runLengthsM");
  const runCoreRecoveriesPercent = input.recoveredCoreLengthsM.map(
    (v, i) => 100 * fraction(v / input.runLengthsM[i], "recoveredCoreLengthsM"),
  );
  return {
    runCoreRecoveriesPercent,
    pooledCoreRecoveryPercent:
      (100 * input.recoveredCoreLengthsM.reduce((a, b) => a + b, 0)) /
      input.runLengthsM.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  runLengthsM: [2, 3],
  recoveredCoreLengthsM: [1.5, 2.5],
} satisfies Input;
export const exampleOutput = {
  runCoreRecoveriesPercent: [75, 83.33333333333333],
  pooledCoreRecoveryPercent: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/core-recovery-percentage",
  title: "Core Recovery Percentage",
  description:
    "Compute run and length-weighted total core recovery from all recovered material; distinct from RQD intact-piece length filtering.",
  inputs: inputFields,
  outputs: [
    {
      id: "runCoreRecoveriesPercent",
      label: "Run core recoveries percent",
      kind: "numberList",
    },
    {
      id: "pooledCoreRecoveryPercent",
      label: "Pooled core recovery percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      runLengthsM: value.runLengthsM as readonly number[],
      recoveredCoreLengthsM: value.recoveredCoreLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
