import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PaEfficiencyPaeInput = {
  readonly rfOutputWatts: number;
  readonly rfInputWatts: number;
  readonly dcSupplyWatts: number;
};

export type PaEfficiencyPaeOutput = {
  readonly powerAddedEfficiencyPercent: number;
};

export const paEfficiencyPaeExample = {
  input: { rfOutputWatts: 50, rfInputWatts: 10, dcSupplyWatts: 100 },
  output: { powerAddedEfficiencyPercent: 40 },
} satisfies ToolExample<PaEfficiencyPaeInput, PaEfficiencyPaeOutput>;

export const paEfficiencyPaeTool = createSimpleTool({
  id: "electronics/pa-efficiency-pae",
  title: "PAE Calculator",
  description:
    "Compute power added efficiency percent as (RF output - RF input) / DC supply x 100.",
  inputs: [
    {
      id: "rfOutputWatts",
      label: "RF output power",
      kind: "number",
      unit: "W",
    },
    { id: "rfInputWatts", label: "RF input power", kind: "number", unit: "W" },
    {
      id: "dcSupplyWatts",
      label: "DC supply power",
      kind: "number",
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "powerAddedEfficiencyPercent",
      label: "Power added efficiency",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const rfOutputWatts = input.rfOutputWatts as number;
    const rfInputWatts = input.rfInputWatts as number;
    const dcSupplyWatts = input.dcSupplyWatts as number;
    if (!(dcSupplyWatts > 0))
      simpleError(
        "dcSupplyWatts",
        "DC supply power must be positive.",
        "invalid_powers",
      );
    if (!(rfInputWatts >= 0))
      simpleError(
        "rfInputWatts",
        "RF input power must not be negative.",
        "invalid_powers",
      );
    if (!(rfOutputWatts >= rfInputWatts))
      simpleError(
        "rfOutputWatts",
        "RF output power must not be below RF input power.",
        "invalid_powers",
      );
    return {
      powerAddedEfficiencyPercent:
        ((rfOutputWatts - rfInputWatts) / dcSupplyWatts) * 100,
    };
  },
});
export const runPaEfficiencyPae = paEfficiencyPaeTool.execute;
export default paEfficiencyPaeTool;
