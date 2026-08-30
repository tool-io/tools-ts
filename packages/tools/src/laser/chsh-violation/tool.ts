import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly correlation00: number;
  readonly correlation01: number;
  readonly correlation10: number;
  readonly correlation11: number;
}>;
export type Output = Readonly<{
  readonly chshS: number;
  readonly violatesClassicalBound: boolean;
}>;

export const calculate = (input: Input): Output => {
  const chshS = Math.abs(
    input.correlation00 +
      input.correlation01 +
      input.correlation10 -
      input.correlation11,
  );
  return { chshS, violatesClassicalBound: chshS > 2 };
};

export const exampleInput = {
  correlation00: 0.7,
  correlation01: 0.7,
  correlation10: 0.7,
  correlation11: -0.7,
} satisfies Input;
export const exampleOutput = {
  chshS: 2.8,
  violatesClassicalBound: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      correlation00: input.correlation00 as number,
      correlation01: input.correlation01 as number,
      correlation10: input.correlation10 as number,
      correlation11: input.correlation11 as number,
    }),
  description: "Calculate CHSH S from four measured correlations.",
  id: "laser/chsh-violation",
  inputs: [
    {
      id: "correlation00",
      label: "Correlation E00",
      kind: "number",
      minimum: -1,
      maximum: 1,
    },
    {
      id: "correlation01",
      label: "Correlation E01",
      kind: "number",
      minimum: -1,
      maximum: 1,
    },
    {
      id: "correlation10",
      label: "Correlation E10",
      kind: "number",
      minimum: -1,
      maximum: 1,
    },
    {
      id: "correlation11",
      label: "Correlation E11",
      kind: "number",
      minimum: -1,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "chshS", label: "CHSH S value", kind: "number", minimum: 0 },
    {
      id: "violatesClassicalBound",
      label: "Violates classical bound",
      kind: "boolean",
    },
  ],
  title: "CHSH Violation",
});

export const run = tool.execute;
export default tool;
