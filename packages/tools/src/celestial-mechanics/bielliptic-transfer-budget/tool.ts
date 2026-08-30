import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, speed, period } from "../shared.js";

export type Input = Readonly<{
  readonly mu: number;
  readonly initialRadius: number;
  readonly finalRadius: number;
  readonly intermediateApoapsis: number;
}>;
export type Output = Readonly<{
  readonly burnMagnitudes: readonly number[];
  readonly totalDeltaV: number;
  readonly transferTime: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.mu, "mu");
  positive(input.initialRadius, "initialRadius");
  positive(input.finalRadius, "finalRadius");
  positive(input.intermediateApoapsis, "intermediateApoapsis");
  if (
    input.intermediateApoapsis <
    Math.max(input.initialRadius, input.finalRadius)
  )
    simpleError(
      "intermediateApoapsis",
      "Intermediate apoapsis must enclose both circular endpoints.",
    );
  const a1 = (input.initialRadius + input.intermediateApoapsis) / 2,
    a2 = (input.finalRadius + input.intermediateApoapsis) / 2,
    burnMagnitudes = [
      Math.abs(
        speed(input.mu, input.initialRadius, a1) -
          Math.sqrt(input.mu / input.initialRadius),
      ),
      Math.abs(
        speed(input.mu, input.intermediateApoapsis, a2) -
          speed(input.mu, input.intermediateApoapsis, a1),
      ),
      Math.abs(
        Math.sqrt(input.mu / input.finalRadius) -
          speed(input.mu, input.finalRadius, a2),
      ),
    ];
  return {
    burnMagnitudes,
    totalDeltaV: burnMagnitudes.reduce((a, b) => a + b, 0),
    transferTime: (period(input.mu, a1) + period(input.mu, a2)) / 2,
  };
};
export const exampleInput = {
  mu: 1,
  initialRadius: 1,
  finalRadius: 4,
  intermediateApoapsis: 9,
} satisfies Input;
export const exampleOutput = {
  burnMagnitudes: [
    0.34164078649987384, 0.11241698168425943, 0.08834840541455213,
  ],
  totalDeltaV: 0.5424061735986854,
  transferTime: 87.18596094954944,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/bielliptic-transfer-budget",
  title: "Bielliptic Transfer Budget",
  description:
    "Budget all three bielliptic burns and transfer coast time for coplanar circular endpoints in consistent km/s units.",
  inputs: [
    {
      id: "mu",
      label: "Mu",
      kind: "number",
      description:
        "Gravitational parameter, using the same distance and time units throughout; km³/s² for km and seconds.",
    },
    { id: "initialRadius", label: "Initial radius", kind: "number" },
    { id: "finalRadius", label: "Final radius", kind: "number" },
    {
      id: "intermediateApoapsis",
      label: "Intermediate apoapsis",
      kind: "number",
    },
  ],
  outputs: [
    { id: "burnMagnitudes", label: "Burn magnitudes", kind: "numberList" },
    { id: "totalDeltaV", label: "Total delta v", kind: "number" },
    { id: "transferTime", label: "Transfer time", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      mu: value.mu as number,
      initialRadius: value.initialRadius as number,
      finalRadius: value.finalRadius as number,
      intermediateApoapsis: value.intermediateApoapsis as number,
    }),
});
export const run = tool.execute;
export default tool;
