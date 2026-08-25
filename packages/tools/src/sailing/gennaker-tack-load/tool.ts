import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GennakerTackLoadInput = {
  readonly sailAreaM2: number;
  readonly windSpeedMs: number;
};

export type GennakerTackLoadOutput = {
  readonly tackLoadNewtons: number;
};

const GENNAKER_LOAD_COEFFICIENT = 0.06;

export const gennakerTackLoadExample = {
  input: { sailAreaM2: 100, windSpeedMs: 8 },
  output: { tackLoadNewtons: 384 },
} satisfies ToolExample<GennakerTackLoadInput, GennakerTackLoadOutput>;

export const gennakerTackLoadTool = createSimpleTool({
  calculate: (input) => {
    const windSpeedMs = input.windSpeedMs as number;
    const sailAreaM2 = input.sailAreaM2 as number;
    if (windSpeedMs < 0)
      simpleError(
        "windSpeedMs",
        "Wind speed cannot be negative.",
        "invalid_wind",
      );
    if (sailAreaM2 < 0)
      simpleError(
        "sailAreaM2",
        "Sail area cannot be negative.",
        "invalid_area",
      );
    return {
      tackLoadNewtons:
        GENNAKER_LOAD_COEFFICIENT * windSpeedMs * windSpeedMs * sailAreaM2,
    };
  },
  description:
    "Estimate the tack line load of a gennaker using tackLoadNewtons = 0.06 * windSpeedMs^2 * sailAreaM2 with a documented gennaker load coefficient.",
  id: "sailing/gennaker-tack-load",
  inputs: [
    {
      description: "Gennaker area projected to the wind.",
      id: "sailAreaM2",
      kind: "number",
      label: "Sail area",
      minimum: 0,
      unit: "m\u00B2",
    },
    {
      description: "True wind speed at sail height.",
      id: "windSpeedMs",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Tensile load on the gennaker tack line.",
      format: "force",
      id: "tackLoadNewtons",
      kind: "number",
      label: "Tack load",
      unit: "N",
    },
  ],
  title: "Gennaker Tack Load",
});
export const runGennakerTackLoad = gennakerTackLoadTool.execute;
export default gennakerTackLoadTool;
