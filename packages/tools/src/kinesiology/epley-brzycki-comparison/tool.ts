import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly liftKg: number;
  readonly repetitions: number;
}>;
export type Output = Readonly<{
  readonly epleyOneRepMaxKg: number;
  readonly brzyckiOneRepMaxKg: number;
  readonly differenceKg: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.liftKg <= 0 ||
    !Number.isSafeInteger(input.repetitions) ||
    input.repetitions < 1 ||
    input.repetitions >= 37
  )
    simpleError(
      "repetitions",
      "Positive lifted mass and an integer repetition count from 1 to 36 required.",
    );
  const epleyOneRepMaxKg =
      input.repetitions === 1
        ? input.liftKg
        : input.liftKg * (1 + input.repetitions / 30),
    brzyckiOneRepMaxKg = (input.liftKg * 36) / (37 - input.repetitions);
  return {
    epleyOneRepMaxKg,
    brzyckiOneRepMaxKg,
    differenceKg: epleyOneRepMaxKg - brzyckiOneRepMaxKg,
  };
};
export const exampleInput = { liftKg: 100, repetitions: 5 } satisfies Input;
export const exampleOutput = {
  epleyOneRepMaxKg: 116.66666666666667,
  brzyckiOneRepMaxKg: 112.5,
  differenceKg: 4.166666666666671,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/epley-brzycki-comparison",
  title: "Epley Brzycki Comparison",
  description:
    "Compare Epley and Brzycki one-rep-max estimates from load and repetitions.",
  inputs: [
    { id: "liftKg", label: "Lift kg", kind: "number" },
    { id: "repetitions", label: "Repetitions", kind: "number" },
  ],
  outputs: [
    { id: "epleyOneRepMaxKg", label: "Epley one rep max kg", kind: "number" },
    {
      id: "brzyckiOneRepMaxKg",
      label: "Brzycki one rep max kg",
      kind: "number",
    },
    { id: "differenceKg", label: "Difference kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      liftKg: value.liftKg as number,
      repetitions: value.repetitions as number,
    }),
});
export const run = tool.execute;
export default tool;
