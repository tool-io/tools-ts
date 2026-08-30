import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpinValveGmrRatioInput = Readonly<{
  readonly antiparallelOhms: number;
  readonly parallelOhms: number;
}>;
export type SpinValveGmrRatioOutput = Readonly<{
  readonly gmrPercent: number;
}>;

export const calculateSpinValveGmrRatio = (
  x: SpinValveGmrRatioInput,
): SpinValveGmrRatioOutput => {
  if (!Number.isFinite(x.antiparallelOhms) || x.antiparallelOhms < 0)
    simpleError("antiparallelOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.parallelOhms) || x.parallelOhms < 0)
    simpleError("parallelOhms", "Provide a finite number at least 0.");
  if (x.antiparallelOhms < x.parallelOhms)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const gmrPercent =
    (100 * (x.antiparallelOhms - x.parallelOhms)) / x.parallelOhms;
  if (!Number.isFinite(gmrPercent))
    simpleError(
      "gmrPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { gmrPercent: Object.is(gmrPercent, -0) ? 0 : gmrPercent };
};

export const example = {
  input: { antiparallelOhms: 120, parallelOhms: 100 },
  output: { gmrPercent: 20 },
} satisfies ToolExample<SpinValveGmrRatioInput, SpinValveGmrRatioOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/spin-valve-gmr-ratio",
  title: "Spin Valve GMR Ratio",
  description:
    "Giant-magnetoresistance ratio from antiparallel and parallel spin-valve resistances at the same temperature.",
  inputs: [
    {
      id: "antiparallelOhms",
      kind: "number",
      label: "Antiparallel Ohms",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "parallelOhms",
      kind: "number",
      label: "Parallel Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "gmrPercent", kind: "number", label: "Gmr Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculateSpinValveGmrRatio({
      antiparallelOhms: input.antiparallelOhms as number,
      parallelOhms: input.parallelOhms as number,
    }),
});
export const spinValveGmrRatioTool = tool;
export const runSpinValveGmrRatio = tool.execute;
export default tool;
