import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MtjTmrRatioInput = Readonly<{
  readonly antiparallelOhms: number;
  readonly parallelOhms: number;
}>;
export type MtjTmrRatioOutput = Readonly<{
  readonly tmrPercent: number;
}>;

export const calculateMtjTmrRatio = (
  x: MtjTmrRatioInput,
): MtjTmrRatioOutput => {
  if (!Number.isFinite(x.antiparallelOhms) || x.antiparallelOhms < 0)
    simpleError("antiparallelOhms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.parallelOhms) || x.parallelOhms < 0)
    simpleError("parallelOhms", "Provide a finite number at least 0.");
  if (x.antiparallelOhms < x.parallelOhms)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const tmrPercent =
    (100 * (x.antiparallelOhms - x.parallelOhms)) / x.parallelOhms;
  if (!Number.isFinite(tmrPercent))
    simpleError(
      "tmrPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { tmrPercent: Object.is(tmrPercent, -0) ? 0 : tmrPercent };
};

export const example = {
  input: { antiparallelOhms: 200, parallelOhms: 100 },
  output: { tmrPercent: 100 },
} satisfies ToolExample<MtjTmrRatioInput, MtjTmrRatioOutput>;

export const tool = createSimpleTool({
  id: "semiconductor/mtj-tmr-ratio",
  title: "Mtj TMR Ratio",
  description:
    "Tunnel-magnetoresistance ratio of an MTJ from antiparallel and parallel resistance measurements.",
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
    { id: "tmrPercent", kind: "number", label: "Tmr Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculateMtjTmrRatio({
      antiparallelOhms: input.antiparallelOhms as number,
      parallelOhms: input.parallelOhms as number,
    }),
});
export const mtjTmrRatioTool = tool;
export const runMtjTmrRatio = tool.execute;
export default tool;
