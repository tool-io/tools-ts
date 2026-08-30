import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requiredLinesNanometers: readonly number[];
  readonly availableLinesNanometers: readonly number[];
  readonly toleranceNanometers: number;
}>;
export type Output = Readonly<{
  readonly coveredLineCount: number;
  readonly coveragePercent: number;
  readonly missingLinesNanometers: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  if (
    input.requiredLinesNanometers.length === 0 ||
    input.availableLinesNanometers.length === 0
  )
    simpleError(
      "requiredLinesNanometers",
      "Required and available line lists must be nonempty.",
      "empty_lines",
    );
  const missingLinesNanometers = input.requiredLinesNanometers.filter(
    (required) =>
      !input.availableLinesNanometers.some(
        (available) =>
          Math.abs(available - required) <= input.toleranceNanometers,
      ),
  );
  const coveredLineCount =
    input.requiredLinesNanometers.length - missingLinesNanometers.length;
  return {
    coveredLineCount,
    coveragePercent:
      (coveredLineCount / input.requiredLinesNanometers.length) * 100,
    missingLinesNanometers,
  };
};

export const exampleInput = {
  requiredLinesNanometers: [405, 488, 640],
  availableLinesNanometers: [404, 490, 638],
  toleranceNanometers: 2,
} satisfies Input;
export const exampleOutput = {
  coveredLineCount: 3,
  coveragePercent: 100,
  missingLinesNanometers: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      requiredLinesNanometers:
        input.requiredLinesNanometers as readonly number[],
      availableLinesNanometers:
        input.availableLinesNanometers as readonly number[],
      toleranceNanometers: input.toleranceNanometers as number,
    }),
  description:
    "Match required flow-cytometry excitation lines to available lines within a supplied tolerance.",
  id: "laser/flow-cytometry-line-coverage",
  inputs: [
    {
      id: "requiredLinesNanometers",
      label: "Required excitation lines",
      kind: "numberList",
      unit: "nm",
    },
    {
      id: "availableLinesNanometers",
      label: "Available laser lines",
      kind: "numberList",
      unit: "nm",
    },
    {
      id: "toleranceNanometers",
      label: "Matching tolerance",
      kind: "number",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      id: "coveredLineCount",
      label: "Covered required lines",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "coveragePercent",
      label: "Line coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "missingLinesNanometers",
      label: "Missing required lines",
      kind: "numberList",
      unit: "nm",
    },
  ],
  title: "Flow-Cytometry Line Coverage",
});

export const run = tool.execute;
export default tool;
