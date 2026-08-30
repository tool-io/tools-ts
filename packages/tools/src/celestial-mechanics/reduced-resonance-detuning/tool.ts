import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, count } from "../shared.js";

export type Input = Readonly<{
  readonly firstPeriod: number;
  readonly secondPeriod: number;
  readonly p: number;
  readonly q: number;
  readonly maximumRelativeDetuning: number;
}>;
export type Output = Readonly<{
  readonly reducedP: number;
  readonly reducedQ: number;
  readonly resonanceOrder: number;
  readonly relativeDetuning: number;
  readonly nearResonance: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.firstPeriod, "firstPeriod");
  positive(input.secondPeriod, "secondPeriod");
  count(input.p, "p", 1);
  count(input.q, "q", 1);
  nonnegative(input.maximumRelativeDetuning, "maximumRelativeDetuning");
  let a = input.p,
    b = input.q;
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  const reducedP = input.p / a,
    reducedQ = input.q / a,
    relativeDetuning =
      input.secondPeriod / input.firstPeriod / (reducedP / reducedQ) - 1;
  return {
    reducedP,
    reducedQ,
    resonanceOrder: Math.abs(reducedP - reducedQ),
    relativeDetuning,
    nearResonance: Math.abs(relativeDetuning) <= input.maximumRelativeDetuning,
  };
};
export const exampleInput = {
  firstPeriod: 2,
  secondPeriod: 3,
  p: 6,
  q: 4,
  maximumRelativeDetuning: 0.01,
} satisfies Input;
export const exampleOutput = {
  reducedP: 3,
  reducedQ: 2,
  resonanceOrder: 1,
  relativeDetuning: 0,
  nearResonance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/reduced-resonance-detuning",
  title: "Reduced Resonance Detuning",
  description:
    "Reduce a candidate period-ratio resonance to coprime integers and report relative detuning; proximity alone does not show resonant angle libration.",
  inputs: [
    { id: "firstPeriod", label: "First period", kind: "number" },
    { id: "secondPeriod", label: "Second period", kind: "number" },
    { id: "p", label: "P", kind: "integer" },
    { id: "q", label: "Q", kind: "integer" },
    {
      id: "maximumRelativeDetuning",
      label: "Maximum relative detuning",
      kind: "number",
    },
  ],
  outputs: [
    { id: "reducedP", label: "Reduced p", kind: "number" },
    { id: "reducedQ", label: "Reduced q", kind: "number" },
    { id: "resonanceOrder", label: "Resonance order", kind: "number" },
    { id: "relativeDetuning", label: "Relative detuning", kind: "number" },
    { id: "nearResonance", label: "Near resonance", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      firstPeriod: value.firstPeriod as number,
      secondPeriod: value.secondPeriod as number,
      p: value.p as number,
      q: value.q as number,
      maximumRelativeDetuning: value.maximumRelativeDetuning as number,
    }),
});
export const run = tool.execute;
export default tool;
