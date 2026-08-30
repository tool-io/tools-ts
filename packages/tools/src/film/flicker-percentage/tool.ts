import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlickerPercentageInput = Readonly<{
  readonly maximumSignal: number;
  readonly minimumSignal: number;
}>;
export type FlickerPercentageOutput = Readonly<{
  readonly flickerPercent: number;
}>;

export const calculateFlickerPercentage = (
  x: FlickerPercentageInput,
): FlickerPercentageOutput => {
  if (!Number.isFinite(x.maximumSignal) || x.maximumSignal < 0)
    simpleError("maximumSignal", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.minimumSignal) || x.minimumSignal < 0)
    simpleError("minimumSignal", "Provide a finite number at least 0.");
  if (x.minimumSignal > x.maximumSignal)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const flickerPercent =
    (100 * (x.maximumSignal - x.minimumSignal)) /
    (x.maximumSignal + x.minimumSignal);
  if (!Number.isFinite(flickerPercent))
    simpleError(
      "flickerPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { flickerPercent: Object.is(flickerPercent, -0) ? 0 : flickerPercent };
};

export const example = {
  input: { maximumSignal: 100, minimumSignal: 20 },
  output: { flickerPercent: 66.66666666666667 },
} satisfies ToolExample<FlickerPercentageInput, FlickerPercentageOutput>;

export const tool = createSimpleTool({
  id: "film/flicker-percentage",
  title: "Flicker Percentage",
  description:
    "Percent flicker (modulation depth) as 100(max−min)/(max+min) from nonnegative light-output extrema.",
  inputs: [
    {
      id: "maximumSignal",
      kind: "number",
      label: "Maximum Signal",
      minimum: 0,
    },
    {
      id: "minimumSignal",
      kind: "number",
      label: "Minimum Signal",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "flickerPercent",
      kind: "number",
      label: "Flicker Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFlickerPercentage({
      maximumSignal: input.maximumSignal as number,
      minimumSignal: input.minimumSignal as number,
    }),
});
export const flickerPercentageTool = tool;
export const runFlickerPercentage = tool.execute;
export default tool;
