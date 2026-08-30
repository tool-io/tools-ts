import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly flightSeconds: number;
  readonly gravityMps2: number;
}>;
export type Output = Readonly<{
  readonly heightM: number;
  readonly heightCm: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.flightSeconds < 0 || input.gravityMps2 <= 0)
    simpleError(
      "flightSeconds",
      "Nonnegative flight duration and positive gravity required.",
    );
  const heightM = (input.gravityMps2 * input.flightSeconds ** 2) / 8;
  return { heightM, heightCm: 100 * heightM };
};
export const exampleInput = {
  flightSeconds: 0.4,
  gravityMps2: 10,
} satisfies Input;
export const exampleOutput = {
  heightM: 0.20000000000000004,
  heightCm: 20.000000000000004,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/flight-time-jump-height",
  title: "Flight Time Jump Height",
  description:
    "Infer ballistic jump height from flight time and supplied gravitational acceleration.",
  inputs: [
    { id: "flightSeconds", label: "Flight seconds", kind: "number" },
    { id: "gravityMps2", label: "Gravity mps 2", kind: "number" },
  ],
  outputs: [
    { id: "heightM", label: "Height m", kind: "number" },
    { id: "heightCm", label: "Height cm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      flightSeconds: value.flightSeconds as number,
      gravityMps2: value.gravityMps2 as number,
    }),
});
export const run = tool.execute;
export default tool;
