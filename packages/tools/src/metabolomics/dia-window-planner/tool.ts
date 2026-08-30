import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly minMz: number;
  readonly maxMz: number;
  readonly windowWidthMz: number;
}>;
export type Output = Readonly<{
  readonly windowStartsMz: readonly number[];
  readonly windowEndsMz: readonly number[];
  readonly windowCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.minMz < 0 ||
    input.maxMz <= input.minMz ||
    input.windowWidthMz <= 0 ||
    Math.ceil((input.maxMz - input.minMz) / input.windowWidthMz) > 10000
  )
    simpleError(
      "windowWidthMz",
      "Valid positive bounded m/z range and width required.",
    );
  const count = Math.ceil((input.maxMz - input.minMz) / input.windowWidthMz),
    windowStartsMz = Array.from(
      { length: count },
      (_, i) => input.minMz + i * input.windowWidthMz,
    );
  return {
    windowStartsMz,
    windowEndsMz: windowStartsMz.map((v) =>
      Math.min(input.maxMz, v + input.windowWidthMz),
    ),
    windowCount: count,
  };
};
export const exampleInput = {
  minMz: 400,
  maxMz: 500,
  windowWidthMz: 40,
} satisfies Input;
export const exampleOutput = {
  windowStartsMz: [400, 440, 480],
  windowEndsMz: [440, 480, 500],
  windowCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/dia-window-planner",
  title: "DIA Window Planner",
  description: "Partition a DIA m/z span into contiguous isolation windows.",
  inputs: [
    { id: "minMz", kind: "number", label: "Min mz" },
    { id: "maxMz", kind: "number", label: "Max mz" },
    { id: "windowWidthMz", kind: "number", label: "Window width mz" },
  ],
  outputs: [
    { id: "windowStartsMz", kind: "numberList", label: "Window starts mz" },
    { id: "windowEndsMz", kind: "numberList", label: "Window ends mz" },
    { id: "windowCount", kind: "number", label: "Window count" },
  ],
  calculate: (value) =>
    calculate({
      minMz: value.minMz as number,
      maxMz: value.maxMz as number,
      windowWidthMz: value.windowWidthMz as number,
    }),
});
export const run = tool.execute;
export default tool;
