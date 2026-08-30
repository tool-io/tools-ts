import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly controlAcceptors: readonly number[];
  readonly treatmentAcceptors: readonly number[];
  readonly minimumShiftPoints: number;
}>;
export type Output = Readonly<{
  readonly firstAcceptorShiftPoints: number;
  readonly shifted: boolean;
}>;

export const calculate = (input: Input): Output => {
  const a = input.controlAcceptors.reduce((x, y) => x + y, 0),
    b = input.treatmentAcceptors.reduce((x, y) => x + y, 0);
  if (
    input.controlAcceptors.length < 2 ||
    input.controlAcceptors.length !== input.treatmentAcceptors.length ||
    a <= 0 ||
    b <= 0 ||
    input.controlAcceptors.some((v) => v < 0) ||
    input.treatmentAcceptors.some((v) => v < 0)
  )
    simpleError(
      "controlAcceptors",
      "Aligned nonnegative acceptor counts with positive totals required.",
    );
  const firstAcceptorShiftPoints =
    (input.treatmentAcceptors[0] / b - input.controlAcceptors[0] / a) * 100;
  return {
    firstAcceptorShiftPoints,
    shifted: Math.abs(firstAcceptorShiftPoints) >= input.minimumShiftPoints,
  };
};

export const exampleInput = {
  controlAcceptors: [80, 20],
  treatmentAcceptors: [40, 60],
  minimumShiftPoints: 20,
} satisfies Input;
export const exampleOutput = {
  firstAcceptorShiftPoints: -40,
  shifted: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/alternative-3prime-splice-shift",
  title: "Alternative 3prime Splice Shift",
  description: "Detect alternative 3-prime acceptor site usage shifts.",
  inputs: [
    { id: "controlAcceptors", kind: "numberList", label: "Control acceptors" },
    {
      id: "treatmentAcceptors",
      kind: "numberList",
      label: "Treatment acceptors",
    },
    {
      id: "minimumShiftPoints",
      kind: "number",
      label: "Minimum shift points",
    },
  ],
  outputs: [
    {
      id: "firstAcceptorShiftPoints",
      kind: "number",
      label: "First acceptor shift points",
    },
    { id: "shifted", kind: "boolean", label: "Shifted" },
  ],
  calculate: (value) =>
    calculate({
      controlAcceptors: value.controlAcceptors as readonly number[],
      treatmentAcceptors: value.treatmentAcceptors as readonly number[],
      minimumShiftPoints: value.minimumShiftPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
