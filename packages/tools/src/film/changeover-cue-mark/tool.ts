import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualTotalReelFrames: number;
  readonly callerProjectionistEstablishedCueLeadFrames: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTotalReelFrames",
    label: "Actual total reel frames",
    kind: "number",
  },
  {
    id: "callerProjectionistEstablishedCueLeadFrames",
    label: "Caller projectionist established cue lead frames",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualTotalReelFrames, "actualTotalReelFrames", 0, 1000000);
  bounded(
    input.callerProjectionistEstablishedCueLeadFrames,
    "callerProjectionistEstablishedCueLeadFrames",
    0,
    1000000,
  );
  if (
    input.callerProjectionistEstablishedCueLeadFrames >
    input.actualTotalReelFrames
  )
    simpleError("cue", "Actualcuewithinreel.");
  return {
    value:
      input.actualTotalReelFrames -
      input.callerProjectionistEstablishedCueLeadFrames,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTotalReelFrames: 100,
    callerProjectionistEstablishedCueLeadFrames: 20,
  },
  output: { result: { value: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/changeover-cue-mark",
  title: "Changeover Cue Mark Calculator",
  description:
    "Recorded cue frame index from total frames minus independent qualified cue lead whole frames, indexed from0reel frame boundary. No universal changeover lead time or automatic projection instructions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
