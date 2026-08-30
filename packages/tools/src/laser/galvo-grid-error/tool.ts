import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly xErrorsMillimeters: readonly number[];
  readonly yErrorsMillimeters: readonly number[];
}>;
export type Output = Readonly<{
  readonly rmsRadialErrorMillimeters: number;
  readonly maximumRadialErrorMillimeters: number;
  readonly sampleCount: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.xErrorsMillimeters.length;
  if (n === 0 || input.yErrorsMillimeters.length !== n)
    simpleError(
      "xErrorsMillimeters",
      "X and Y error lists must be aligned and nonempty.",
      "invalid_grid",
    );
  const radial = input.xErrorsMillimeters.map((value, index) =>
    Math.hypot(value, input.yErrorsMillimeters[index]),
  );
  return {
    rmsRadialErrorMillimeters: Math.sqrt(
      radial.reduce((sum, value) => sum + value * value, 0) / n,
    ),
    maximumRadialErrorMillimeters: Math.max(...radial),
    sampleCount: n,
  };
};

export const exampleInput = {
  xErrorsMillimeters: [3, 0],
  yErrorsMillimeters: [4, 0],
} satisfies Input;
export const exampleOutput = {
  rmsRadialErrorMillimeters: 3.5355339059327378,
  maximumRadialErrorMillimeters: 5,
  sampleCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      xErrorsMillimeters: input.xErrorsMillimeters as readonly number[],
      yErrorsMillimeters: input.yErrorsMillimeters as readonly number[],
    }),
  description:
    "Summarize radial positioning error from a galvo calibration grid.",
  id: "laser/galvo-grid-error",
  inputs: [
    {
      id: "xErrorsMillimeters",
      label: "Grid X errors",
      kind: "numberList",
      unit: "mm",
    },
    {
      id: "yErrorsMillimeters",
      label: "Grid Y errors",
      kind: "numberList",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "rmsRadialErrorMillimeters",
      label: "RMS radial error",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "maximumRadialErrorMillimeters",
      label: "Maximum radial error",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "sampleCount",
      label: "Grid sample count",
      kind: "integer",
      minimum: 1,
    },
  ],
  title: "Galvo Grid Error",
});

export const run = tool.execute;
export default tool;
