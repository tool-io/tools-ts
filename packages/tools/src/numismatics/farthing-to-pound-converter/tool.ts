import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FarthingToPoundConverterInput = Readonly<{
  readonly farthings: number;
}>;
export type FarthingToPoundConverterOutput = Readonly<{
  readonly pounds: number;
}>;

export const calculateFarthingToPoundConverter = (
  x: FarthingToPoundConverterInput,
): FarthingToPoundConverterOutput => {
  if (
    !Number.isFinite(x.farthings) ||
    x.farthings < 0 ||
    !Number.isSafeInteger(x.farthings)
  )
    simpleError("farthings", "Provide a nonnegative whole number.");
  const pounds = x.farthings / 960;
  if (!Number.isFinite(pounds))
    simpleError(
      "pounds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pounds: Object.is(pounds, -0) ? 0 : pounds };
};

export const example = {
  input: {
    farthings: 960,
  },
  output: { pounds: 1 },
} satisfies ToolExample<
  FarthingToPoundConverterInput,
  FarthingToPoundConverterOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/farthing-to-pound-converter",
  title: "Farthing To Pound Converter",
  description:
    "Convert predecimal farthings to pounds: four farthings per penny and 240 pence per pound.",
  inputs: [
    { id: "farthings", kind: "number", label: "Farthings", unit: "farthings" },
  ],
  outputs: [{ id: "pounds", kind: "number", label: "Pounds", unit: "£" }],
  calculate: (input) =>
    calculateFarthingToPoundConverter({
      farthings: input.farthings as number,
    }),
});
export const runFarthingToPoundConverter = tool.execute;
export default tool;
