import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedSilentBeatStartSeconds: readonly number[];
  readonly observedSilentBeatEndSeconds: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedSilentBeatStartSeconds",
    label: "Observed silent beat start seconds",
    kind: "numberList",
  },
  {
    id: "observedSilentBeatEndSeconds",
    label: "Observed silent beat end seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.observedSilentBeatStartSeconds.forEach((v) =>
    nonnegative(v, "observedSilentBeatStartSeconds"),
  );
  input.observedSilentBeatEndSeconds.forEach((v) =>
    nonnegative(v, "observedSilentBeatEndSeconds"),
  );
  aligned(
    input.observedSilentBeatStartSeconds,
    input.observedSilentBeatEndSeconds,
    "observedSilentBeatStartSeconds",
  );
  input.observedSilentBeatStartSeconds.forEach((v, i) => {
    if (
      input.observedSilentBeatEndSeconds[i] < v ||
      (i > 0 && v < input.observedSilentBeatEndSeconds[i - 1])
    )
      simpleError("pauses", "Ordered nonoverlapping actual time intervals.");
  });
  const durations = input.observedSilentBeatStartSeconds.map(
    (v, i) => input.observedSilentBeatEndSeconds[i] - v,
  );
  return {
    pauseDurationsSeconds: durations,
    totalSilentSeconds: sum(durations),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedSilentBeatStartSeconds: [1, 5],
    observedSilentBeatEndSeconds: [2.5, 7],
  },
  output: {
    result: { pauseDurationsSeconds: [1.5, 2], totalSilentSeconds: 3.5 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/dramatic-pause-silent-beat-duration-counter",
  title: "Dramatic Pause Silent Beat Duration Counter",
  description:
    "Measure independently annotated nonoverlapping pauses on a shared recording timeline; not infer dramatic intent.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
