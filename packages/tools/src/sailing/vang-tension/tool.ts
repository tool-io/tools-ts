import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type VangTensionInput = {
  maxWindKt?: number;
  windSpeedKt: number;
};

export type VangTensionOutput = {
  vangTensionPercent: number;
};

const DEFAULT_MAX_WIND_KT = 25;

export const vangTensionExample = {
  input: { windSpeedKt: 12.5 },
  output: { vangTensionPercent: 50 },
} satisfies ToolExample<VangTensionInput, VangTensionOutput>;

export const vangTensionTool = createSimpleTool({
  calculate: (input) => {
    const maxWindKt =
      (input.maxWindKt as number | undefined) ?? DEFAULT_MAX_WIND_KT;
    return {
      vangTensionPercent: Math.min(
        100,
        Math.max(
          10,
          Math.round(((input.windSpeedKt as number) / maxWindKt) * 100),
        ),
      ),
    };
  },
  description:
    "Suggest vang tension from vangPercent = min(100, max(10, round(windSpeedKt / maxWindKt * 100))) using the boat's maximum working wind.",
  id: "sailing/vang-tension",
  inputs: [
    {
      description: "Current wind speed.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kn",
    },
    {
      default: DEFAULT_MAX_WIND_KT,
      description:
        "Maximum working wind for the boat, between 10 and 60 knots.",
      id: "maxWindKt",
      kind: "number",
      label: "Max wind",
      maximum: 60,
      minimum: 10,
      unit: "kn",
    },
  ],
  outputs: [
    {
      description: "Recommended vang tension as a percentage of range.",
      id: "vangTensionPercent",
      kind: "number",
      label: "Vang tension",
      unit: "%",
    },
  ],
  title: "Vang Tension Guide",
});
export const runVangTension = vangTensionTool.execute;
export default vangTensionTool;
