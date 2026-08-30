import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerTurnsRatioSimpleInput = Readonly<{
  readonly primaryTurns: number;
  readonly secondaryTurns: number;
}>;
export type TransformerTurnsRatioSimpleOutput = Readonly<{
  readonly secondaryToPrimaryRatio: number;
}>;

export const calculateTransformerTurnsRatioSimple = (
  x: TransformerTurnsRatioSimpleInput,
): TransformerTurnsRatioSimpleOutput => {
  if (!Number.isFinite(x.primaryTurns) || x.primaryTurns < 1)
    simpleError("primaryTurns", "Provide a positive integer.");
  if (!Number.isFinite(x.secondaryTurns) || x.secondaryTurns < 1)
    simpleError("secondaryTurns", "Provide a positive integer.");
  if (!Number.isInteger(x.primaryTurns) || !Number.isInteger(x.secondaryTurns))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const secondaryToPrimaryRatio = x.secondaryTurns / x.primaryTurns;
  if (!Number.isFinite(secondaryToPrimaryRatio))
    simpleError(
      "secondaryToPrimaryRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    secondaryToPrimaryRatio: Object.is(secondaryToPrimaryRatio, -0)
      ? 0
      : secondaryToPrimaryRatio,
  };
};

export const example = {
  input: { primaryTurns: 1000, secondaryTurns: 100 },
  output: { secondaryToPrimaryRatio: 0.1 },
} satisfies ToolExample<
  TransformerTurnsRatioSimpleInput,
  TransformerTurnsRatioSimpleOutput
>;

export const tool = createSimpleTool({
  id: "engineering/transformer-turns-ratio-simple",
  title: "Transformer Turns Ratio Simple",
  description:
    "Ideal transformer secondary-to-primary voltage ratio from winding turns; neglects losses and leakage.",
  inputs: [
    { id: "primaryTurns", kind: "integer", label: "Primary Turns", minimum: 1 },
    {
      id: "secondaryTurns",
      kind: "integer",
      label: "Secondary Turns",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "secondaryToPrimaryRatio",
      kind: "number",
      label: "Secondary To Primary Ratio",
    },
  ],
  calculate: (input) =>
    calculateTransformerTurnsRatioSimple({
      primaryTurns: input.primaryTurns as number,
      secondaryTurns: input.secondaryTurns as number,
    }),
});
export const transformerTurnsRatioSimpleTool = tool;
export const runTransformerTurnsRatioSimple = tool.execute;
export default tool;
