import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPhraseCounts: number;
  readonly callerCountsPerNotatedBeat: number;
  readonly callerNotatedBeatsPerBar: number;
}>;
export type Output = Readonly<{ readonly conditionalBarsPerPhrase: number }>;
const inputFields = [
  { id: "callerPhraseCounts", label: "Caller phrase counts", kind: "number" },
  {
    id: "callerCountsPerNotatedBeat",
    label: "Caller counts per notated beat",
    kind: "number",
  },
  {
    id: "callerNotatedBeatsPerBar",
    label: "Caller notated beats per bar",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCountsPerNotatedBeat, "callerCountsPerNotatedBeat");
  positive(input.callerNotatedBeatsPerBar, "callerNotatedBeatsPerBar");
  nonnegative(input.callerPhraseCounts, "callerPhraseCounts");
  return {
    conditionalBarsPerPhrase:
      input.callerPhraseCounts /
      (input.callerCountsPerNotatedBeat * input.callerNotatedBeatsPerBar),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPhraseCounts: 32,
  callerCountsPerNotatedBeat: 1,
  callerNotatedBeatsPerBar: 4,
} satisfies Input;
export const exampleOutput = { conditionalBarsPerPhrase: 8 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/bars-per-phrase-32-count-conversion",
  title: "Bars Per Phrase 32 Count Conversion",
  description:
    "Convert declared phrase counts to bars using separately established count/beat and notated beats/bar conventions; fractional bars retained, not count-event audio mapping. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalBarsPerPhrase",
      label: "Conditional bars per phrase",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPhraseCounts: value.callerPhraseCounts as number,
      callerCountsPerNotatedBeat: value.callerCountsPerNotatedBeat as number,
      callerNotatedBeatsPerBar: value.callerNotatedBeatsPerBar as number,
    }),
});
export const run = tool.execute;
export default tool;
