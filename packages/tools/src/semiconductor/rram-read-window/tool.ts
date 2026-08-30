import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RramReadWindowInput = Readonly<{
  readonly highStateOhms: number;
  readonly lowStateOhms: number;
}>;
export type RramReadWindowOutput = Readonly<{
  readonly readWindowRatio: number;
}>;

export const calculateRramReadWindow = (
  x: RramReadWindowInput,
): RramReadWindowOutput => {
  if (!Number.isFinite(x.highStateOhms) || x.highStateOhms < 0)
    simpleError("highStateOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.lowStateOhms) || x.lowStateOhms < 0)
    simpleError("lowStateOhms", "Provide a finite number at least 0.");
  if (x.lowStateOhms > x.highStateOhms)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const readWindowRatio = x.highStateOhms / x.lowStateOhms;
  if (!Number.isFinite(readWindowRatio))
    simpleError(
      "readWindowRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    readWindowRatio: Object.is(readWindowRatio, -0) ? 0 : readWindowRatio,
  };
};

export const example = {
  input: { highStateOhms: 100000, lowStateOhms: 1000 },
  output: { readWindowRatio: 100 },
} satisfies ToolExample<RramReadWindowInput, RramReadWindowOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/rram-read-window",
  title: "RRAM Read Window",
  description:
    "Resistive RAM high-to-low state resistance ratio measured at the same non-disturbing read voltage.",
  inputs: [
    {
      id: "highStateOhms",
      kind: "number",
      label: "High State Ohms",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "lowStateOhms",
      kind: "number",
      label: "Low State Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "readWindowRatio", kind: "number", label: "Read Window Ratio" },
  ],
  calculate: (input) =>
    calculateRramReadWindow({
      highStateOhms: input.highStateOhms as number,
      lowStateOhms: input.lowStateOhms as number,
    }),
});
export const rramReadWindowTool = tool;
export const runRramReadWindow = tool.execute;
export default tool;
