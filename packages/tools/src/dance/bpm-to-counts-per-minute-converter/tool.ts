import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedNotatedBpm: number;
  readonly callerCountsPerNotatedBeat: number;
}>;
export type Output = Readonly<{ readonly conditionalCountsPerMinute: number }>;
const inputFields = [
  { id: "observedNotatedBpm", label: "Observed notated bpm", kind: "number" },
  {
    id: "callerCountsPerNotatedBeat",
    label: "Caller counts per notated beat",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedNotatedBpm, "observedNotatedBpm");
  positive(input.callerCountsPerNotatedBeat, "callerCountsPerNotatedBeat");
  return {
    conditionalCountsPerMinute:
      input.observedNotatedBpm * input.callerCountsPerNotatedBeat,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNotatedBpm: 120,
  callerCountsPerNotatedBeat: 0.5,
} satisfies Input;
export const exampleOutput = {
  conditionalCountsPerMinute: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/bpm-to-counts-per-minute-converter",
  title: "Bpm To Counts Per Minute Converter",
  description:
    "Explicit notated BPM×declared dance counts/beat, not infer half/double feel from timestamps or universal count=beat. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalCountsPerMinute",
      label: "Conditional counts per minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNotatedBpm: value.observedNotatedBpm as number,
      callerCountsPerNotatedBeat: value.callerCountsPerNotatedBeat as number,
    }),
});
export const run = tool.execute;
export default tool;
