import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerFatigueDamageRepetitionCounts: readonly number[];
  readonly callerMatchedFailureRepetitionCounts: readonly number[];
}>;
export type Output = Readonly<{ readonly linearMinerFatigueDamage: number }>;
const inputFields = [
  {
    id: "callerFatigueDamageRepetitionCounts",
    label: "Caller fatigue damage repetition counts",
    kind: "numberList",
  },
  {
    id: "callerMatchedFailureRepetitionCounts",
    label: "Caller matched failure repetition counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedFailureRepetitionCounts.forEach((v) =>
    positive(v, "callerMatchedFailureRepetitionCounts"),
  );
  input.callerFatigueDamageRepetitionCounts.forEach((v) =>
    nonnegative(v, "callerFatigueDamageRepetitionCounts"),
  );
  aligned(
    input.callerFatigueDamageRepetitionCounts,
    input.callerMatchedFailureRepetitionCounts,
    "callerFatigueDamageRepetitionCounts",
  );
  return {
    linearMinerFatigueDamage: sum(
      input.callerFatigueDamageRepetitionCounts.map(
        (v, i) => v / input.callerMatchedFailureRepetitionCounts[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFatigueDamageRepetitionCounts: [10, 20],
  callerMatchedFailureRepetitionCounts: [100, 100],
} satisfies Input;
export const exampleOutput = { linearMinerFatigueDamage: 0.3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/pavement-fatigue-crack-model",
  title: "Pavement Fatigue Crack Model Calculator",
  description:
    "Pavement spectrum Miner damage with independently calibrated per-bin fatigue failure counts, no universal crack-percent mapping or service life prediction. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "linearMinerFatigueDamage",
      label: "Linear miner fatigue damage",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFatigueDamageRepetitionCounts:
        value.callerFatigueDamageRepetitionCounts as readonly number[],
      callerMatchedFailureRepetitionCounts:
        value.callerMatchedFailureRepetitionCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
