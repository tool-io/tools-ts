import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly signalStartBp: number;
  readonly signalEndBp: number;
  readonly retainedStartBp: number;
  readonly retainedEndBp: number;
}>;
export type Output = Readonly<{
  readonly retainedSignalBases: number;
  readonly signalRetainedFraction: number;
  readonly completeSignalRetained: boolean;
}>;
export const calculate = (input: Input): Output => {
  [
    input.signalStartBp,
    input.signalEndBp,
    input.retainedStartBp,
    input.retainedEndBp,
  ].forEach((v) => count(v, "signalStartBp"));
  if (
    input.signalEndBp <= input.signalStartBp ||
    input.retainedEndBp <= input.retainedStartBp
  )
    simpleError(
      "signalEndBp",
      "Nonempty zero-based half-open signal and retained intervals required.",
    );
  const retainedSignalBases = Math.max(
    0,
    Math.min(input.signalEndBp, input.retainedEndBp) -
      Math.max(input.signalStartBp, input.retainedStartBp),
  );
  return {
    retainedSignalBases,
    signalRetainedFraction:
      retainedSignalBases / (input.signalEndBp - input.signalStartBp),
    completeSignalRetained:
      retainedSignalBases === input.signalEndBp - input.signalStartBp,
  };
};
export const exampleInput = {
  signalStartBp: 100,
  signalEndBp: 200,
  retainedStartBp: 150,
  retainedEndBp: 400,
} satisfies Input;
export const exampleOutput = {
  retainedSignalBases: 50,
  signalRetainedFraction: 0.5,
  completeSignalRetained: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/retained-packaging-signal-interval",
  title: "Retained Packaging Signal Interval",
  description:
    "Map retained construct sequence to a supplied packaging-signal interval; sequence overlap alone does not establish functional packaging.",
  inputs: [
    {
      id: "signalStartBp",
      label: "Signal start bp",
      kind: "number",
      description:
        "Zero-based half-open coordinate convention; end positions are exclusive.",
    },
    { id: "signalEndBp", label: "Signal end bp", kind: "number" },
    { id: "retainedStartBp", label: "Retained start bp", kind: "number" },
    { id: "retainedEndBp", label: "Retained end bp", kind: "number" },
  ],
  outputs: [
    {
      id: "retainedSignalBases",
      label: "Retained signal bases",
      kind: "number",
    },
    {
      id: "signalRetainedFraction",
      label: "Signal retained fraction",
      kind: "number",
    },
    {
      id: "completeSignalRetained",
      label: "Complete signal retained",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      signalStartBp: value.signalStartBp as number,
      signalEndBp: value.signalEndBp as number,
      retainedStartBp: value.retainedStartBp as number,
      retainedEndBp: value.retainedEndBp as number,
    }),
});
export const run = tool.execute;
export default tool;
