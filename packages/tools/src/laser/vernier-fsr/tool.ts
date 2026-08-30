import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly firstFsrHertz: number;
  readonly secondFsrHertz: number;
}>;
export type Output = Readonly<{
  readonly fsrDifferenceHertz: number;
  readonly vernierFsrHertz: number;
}>;

export const calculate = (input: Input): Output => {
  const fsrDifferenceHertz = Math.abs(
    input.firstFsrHertz - input.secondFsrHertz,
  );
  if (
    input.firstFsrHertz <= 0 ||
    input.secondFsrHertz <= 0 ||
    fsrDifferenceHertz === 0
  )
    simpleError(
      "secondFsrHertz",
      "Positive unequal FSR values are required.",
      "invalid_fsr",
    );
  return {
    fsrDifferenceHertz,
    vernierFsrHertz:
      (input.firstFsrHertz * input.secondFsrHertz) / fsrDifferenceHertz,
  };
};

export const exampleInput = {
  firstFsrHertz: 100,
  secondFsrHertz: 110,
} satisfies Input;
export const exampleOutput = {
  fsrDifferenceHertz: 10,
  vernierFsrHertz: 1100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      firstFsrHertz: input.firstFsrHertz as number,
      secondFsrHertz: input.secondFsrHertz as number,
    }),
  description:
    "Calculate the approximate compound-cavity Vernier free spectral range.",
  id: "laser/vernier-fsr",
  inputs: [
    {
      id: "firstFsrHertz",
      label: "First-cavity FSR",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "secondFsrHertz",
      label: "Second-cavity FSR",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "fsrDifferenceHertz",
      label: "FSR difference",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
    {
      id: "vernierFsrHertz",
      label: "Vernier free spectral range",
      kind: "number",
      minimum: 0,
      unit: "Hz",
    },
  ],
  title: "Vernier FSR",
});

export const run = tool.execute;
export default tool;
