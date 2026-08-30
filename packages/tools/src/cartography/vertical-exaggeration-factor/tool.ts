import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VerticalExaggerationFactorInput = Readonly<{
  readonly horizontalDenominator: number;
  readonly verticalDenominator: number;
}>;
export type VerticalExaggerationFactorOutput = Readonly<{
  readonly exaggerationFactor: number;
}>;

export const calculateVerticalExaggerationFactor = (
  x: VerticalExaggerationFactorInput,
): VerticalExaggerationFactorOutput => {
  if (!Number.isFinite(x.horizontalDenominator) || x.horizontalDenominator <= 0)
    simpleError("horizontalDenominator", "Provide a finite positive number.");
  if (!Number.isFinite(x.verticalDenominator) || x.verticalDenominator <= 0)
    simpleError("verticalDenominator", "Provide a finite positive number.");
  const exaggerationFactor = x.horizontalDenominator / x.verticalDenominator;
  if (!Number.isFinite(exaggerationFactor))
    simpleError(
      "exaggerationFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    exaggerationFactor: Object.is(exaggerationFactor, -0)
      ? 0
      : exaggerationFactor,
  };
};

export const example = {
  input: {
    horizontalDenominator: 50000,
    verticalDenominator: 5000,
  },
  output: { exaggerationFactor: 10 },
} satisfies ToolExample<
  VerticalExaggerationFactorInput,
  VerticalExaggerationFactorOutput
>;

export const tool = createSimpleTool({
  id: "cartography/vertical-exaggeration-factor",
  title: "Vertical Exaggeration Factor",
  description:
    "Vertical-to-horizontal scale ratio from the horizontal and vertical 1:N denominators.",
  inputs: [
    {
      id: "horizontalDenominator",
      kind: "number",
      label: "Horizontal Denominator",
      minimum: 0,
    },
    {
      id: "verticalDenominator",
      kind: "number",
      label: "Vertical Denominator",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "exaggerationFactor", kind: "number", label: "Exaggeration Factor" },
  ],
  calculate: (input) =>
    calculateVerticalExaggerationFactor({
      horizontalDenominator: input.horizontalDenominator as number,
      verticalDenominator: input.verticalDenominator as number,
    }),
});
export const verticalExaggerationFactorTool = tool;
export const runVerticalExaggerationFactor = tool.execute;
export default tool;
