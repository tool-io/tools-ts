import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type SussreserveSo2UpliftInput = {
  readonly reserveFreeSo2MgPerL?: number;
  readonly reserveVolumeLiters: number;
  readonly wineFreeSo2MgPerL: number;
  readonly wineVolumeLiters: number;
};

export type SussreserveSo2UpliftOutput = {
  readonly blendedFreeSo2MgPerL: number;
  readonly upliftMgPerL: number;
};

export const sussreserveSo2UpliftExample = {
  input: {
    reserveFreeSo2MgPerL: 60,
    reserveVolumeLiters: 50,
    wineFreeSo2MgPerL: 28,
    wineVolumeLiters: 950,
  },
  output: {
    blendedFreeSo2MgPerL: 29.6,
    upliftMgPerL: 1.6,
  },
} satisfies ToolExample<SussreserveSo2UpliftInput, SussreserveSo2UpliftOutput>;

export const calculateSussreserveSo2Uplift = (
  input: SussreserveSo2UpliftInput,
): SussreserveSo2UpliftOutput => {
  const totalVolume = input.wineVolumeLiters + input.reserveVolumeLiters;
  if (totalVolume <= 0)
    simpleError(
      "wineVolumeLiters",
      "The combined volume must be positive.",
      "invalid_value",
    );
  const blendedFree =
    (input.wineVolumeLiters * input.wineFreeSo2MgPerL +
      input.reserveVolumeLiters *
        (input.reserveFreeSo2MgPerL ?? input.wineFreeSo2MgPerL)) /
    totalVolume;
  return {
    blendedFreeSo2MgPerL: roundStatistic(blendedFree),
    upliftMgPerL: roundStatistic(blendedFree - input.wineFreeSo2MgPerL),
  };
};

export const sussreserveSo2UpliftTool = createSimpleTool({
  calculate: (input) =>
    calculateSussreserveSo2Uplift(
      input as unknown as SussreserveSo2UpliftInput,
    ),
  description:
    "Compute how blending in sweet reserve juice moves the free sulfur dioxide of the finished blend.",
  id: "oenology/sussreserve-so2-uplift",
  inputs: [
    {
      default: 0,
      description:
        "Free SO2 carried by the sweet reserve; defaults to the dry wine's level.",
      id: "reserveFreeSo2MgPerL",
      kind: "number",
      label: "Reserve free SO2",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Sweet reserve volume to blend.",
      id: "reserveVolumeLiters",
      kind: "number",
      label: "Reserve volume",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Free SO2 of the dry wine before the blend.",
      id: "wineFreeSo2MgPerL",
      kind: "number",
      label: "Wine free SO2",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Dry wine volume before the blend.",
      id: "wineVolumeLiters",
      kind: "number",
      label: "Wine volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Free SO2 of the finished sweetened blend.",
      id: "blendedFreeSo2MgPerL",
      kind: "number",
      label: "Blended free SO2",
      unit: "mg/L",
    },
    {
      description: "Rise over the dry wine's own free SO2.",
      id: "upliftMgPerL",
      kind: "number",
      label: "SO2 uplift",
      unit: "mg/L",
    },
  ],
  title: "Sussreserve Preservation SO2 Uplift Calculator",
});
export const runSussreserveSo2Uplift = sussreserveSo2UpliftTool.execute;
export default sussreserveSo2UpliftTool;
