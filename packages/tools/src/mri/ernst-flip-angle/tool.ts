import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly trMs: number;
  readonly t1Ms: number;
}>;
export type Output = Readonly<{
  readonly ernstAngleDegrees: number;
}>;
const inputFields = [
  { id: "trMs", label: "Tr ms", kind: "number", unit: "ms" },
  { id: "t1Ms", label: "T1 ms", kind: "number", unit: "ms" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.trMs, "trMs");
  positive(input.t1Ms, "t1Ms");
  return {
    ernstAngleDegrees:
      (Math.acos(Math.exp(-input.trMs / input.t1Ms)) * 180) / Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { trMs: 100, t1Ms: 1000 } satisfies Input;
export const exampleOutput = {
  ernstAngleDegrees: 25.19860510178534,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/ernst-flip-angle",
  title: "Ernst Flip Angle",
  description:
    "Calculate the spoiled steady-state Ernst angle for supplied TR/T1; contrast optimization, B1 inhomogeneity and preparation pulses are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "ernstAngleDegrees",
      label: "Ernst angle degrees",
      kind: "number",
      unit: "°",
    },
  ],
  calculate: (value) =>
    calculate({
      trMs: value.trMs as number,
      t1Ms: value.t1Ms as number,
    }),
});
export const run = tool.execute;
export default tool;
