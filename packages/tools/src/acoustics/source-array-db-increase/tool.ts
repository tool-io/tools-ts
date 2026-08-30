import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SourceArrayDbIncreaseInput = Readonly<{
  readonly sourceCount: number;
}>;
export type SourceArrayDbIncreaseOutput = Readonly<{
  readonly increaseDecibels: number;
}>;

export const calculateSourceArrayDbIncrease = (
  x: SourceArrayDbIncreaseInput,
): SourceArrayDbIncreaseOutput => {
  if (
    !Number.isFinite(x.sourceCount) ||
    !Number.isSafeInteger(x.sourceCount) ||
    x.sourceCount < 1
  )
    simpleError("sourceCount", "Provide a positive safe integer.");
  const increaseDecibels = 10 * Math.log10(x.sourceCount);
  if (!Number.isFinite(increaseDecibels))
    simpleError(
      "increaseDecibels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    increaseDecibels: Object.is(increaseDecibels, -0) ? 0 : increaseDecibels,
  };
};

export const example = {
  input: {
    sourceCount: 2,
  },
  output: { increaseDecibels: 3.010299956639812 },
} satisfies ToolExample<
  SourceArrayDbIncreaseInput,
  SourceArrayDbIncreaseOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/source-array-db-increase",
  title: "Source Array Db Increase",
  description:
    "Free-field energetic level increase in dB from N independent equal-strength incoherent sources.",
  inputs: [
    { id: "sourceCount", kind: "integer", label: "Source Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "increaseDecibels",
      kind: "number",
      label: "Increase Decibels",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateSourceArrayDbIncrease({
      sourceCount: input.sourceCount as number,
    }),
});
export const sourceArrayDbIncreaseTool = tool;
export const runSourceArrayDbIncrease = tool.execute;
export default tool;
