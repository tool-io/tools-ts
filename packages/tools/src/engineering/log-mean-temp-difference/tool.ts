import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LogMeanTempDifferenceInput = Readonly<{
  readonly firstDifferenceKelvin: number;
  readonly secondDifferenceKelvin: number;
}>;
export type LogMeanTempDifferenceOutput = Readonly<{
  readonly lmtdKelvin: number;
}>;

export const calculateLogMeanTempDifference = (
  x: LogMeanTempDifferenceInput,
): LogMeanTempDifferenceOutput => {
  if (!Number.isFinite(x.firstDifferenceKelvin) || x.firstDifferenceKelvin < 0)
    simpleError("firstDifferenceKelvin", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.secondDifferenceKelvin) ||
    x.secondDifferenceKelvin < 0
  )
    simpleError(
      "secondDifferenceKelvin",
      "Provide a finite number at least 0.",
    );
  const lmtdKelvin =
    x.firstDifferenceKelvin === x.secondDifferenceKelvin
      ? x.firstDifferenceKelvin
      : (x.firstDifferenceKelvin - x.secondDifferenceKelvin) /
        Math.log(x.firstDifferenceKelvin / x.secondDifferenceKelvin);
  if (!Number.isFinite(lmtdKelvin))
    simpleError(
      "lmtdKelvin",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { lmtdKelvin: Object.is(lmtdKelvin, -0) ? 0 : lmtdKelvin };
};

export const example = {
  input: { firstDifferenceKelvin: 20, secondDifferenceKelvin: 10 },
  output: { lmtdKelvin: 14.426950408889635 },
} satisfies ToolExample<
  LogMeanTempDifferenceInput,
  LogMeanTempDifferenceOutput
>;

export const tool = createSimpleTool({
  id: "engineering/log-mean-temp-difference",
  title: "Log Mean Temp Difference",
  description:
    "Log-mean of positive terminal temperature differences for a heat exchanger; equal terminal differences return that same difference.",
  inputs: [
    {
      id: "firstDifferenceKelvin",
      kind: "number",
      label: "First Difference Kelvin",
      unit: "K",
      minimum: 0,
    },
    {
      id: "secondDifferenceKelvin",
      kind: "number",
      label: "Second Difference Kelvin",
      unit: "K",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "lmtdKelvin", kind: "number", label: "Lmtd Kelvin", unit: "K" },
  ],
  calculate: (input) =>
    calculateLogMeanTempDifference({
      firstDifferenceKelvin: input.firstDifferenceKelvin as number,
      secondDifferenceKelvin: input.secondDifferenceKelvin as number,
    }),
});
export const logMeanTempDifferenceTool = tool;
export const runLogMeanTempDifference = tool.execute;
export default tool;
