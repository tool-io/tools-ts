import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaBackoffEfficiencyInput = Readonly<{
  readonly rfOutputWatts: number;
  readonly dcInputWatts: number;
}>;
export type PaBackoffEfficiencyOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculatePaBackoffEfficiency = (
  x: PaBackoffEfficiencyInput,
): PaBackoffEfficiencyOutput => {
  if (!Number.isFinite(x.rfOutputWatts) || x.rfOutputWatts < 0)
    simpleError("rfOutputWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dcInputWatts) || x.dcInputWatts < 0)
    simpleError("dcInputWatts", "Provide a finite number at least 0.");
  if (x.rfOutputWatts > x.dcInputWatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const efficiencyPercent = (100 * x.rfOutputWatts) / x.dcInputWatts;
  if (!Number.isFinite(efficiencyPercent))
    simpleError(
      "efficiencyPercent",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: { rfOutputWatts: 10, dcInputWatts: 40 },
  output: { efficiencyPercent: 25 },
} satisfies ToolExample<PaBackoffEfficiencyInput, PaBackoffEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "electronics/pa-backoff-efficiency",
  title: "PA Backoff Efficiency",
  description:
    "Drain efficiency at a power-backoff operating point from RF output and DC input power.",
  inputs: [
    {
      id: "rfOutputWatts",
      kind: "number",
      label: "Rf Output Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "dcInputWatts",
      kind: "number",
      label: "Dc Input Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculatePaBackoffEfficiency({
      rfOutputWatts: input.rfOutputWatts as number,
      dcInputWatts: input.dcInputWatts as number,
    }),
});
export const paBackoffEfficiencyTool = tool;
export const runPaBackoffEfficiency = tool.execute;
export default tool;
