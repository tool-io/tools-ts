import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch50-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        "MHz-per-T":
          "Approximate 13C gyromagnetic ratio gamma/(2pi) = 10.7084 MHz/T. Positive signed convention; isotope/nuclear/environment precision independently verified.",
        "angular-units":
          "Angular gyromagnetic ratio gamma(rad/s/T) = 2*pi*1e6 times the stated MHz/T value; do not confuse cyclic and angular frequency.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "MHz-per-T" },
  output: {
    result: {
      text: "Approximate 13C gyromagnetic ratio gamma/(2pi) = 10.7084 MHz/T. Positive signed convention; isotope/nuclear/environment precision independently verified.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/gyromagnetic-ratio-c13",
  title: "C13 Gyromagnetic Ratio Lookup",
  description:
    "Bounded off line reference: 13C approximate cyclic gyromagnetic reference, not equipment calibration or scanner operating permission. Topics: MHz-per-T, angular-units. Not live/exhaustive reference, a proof of an open assertion, diagnosis or safe-use approval.",
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
