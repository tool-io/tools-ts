import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const arrayApertureMoveoutResolutionCheckerExample = {
  input: { apertureKm: 10, minSlownessSPerDeg: 4, maxSlownessSPerDeg: 8 },
  output: { moveoutSpanS: 0.35972840505418413, resolvable: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const arrayApertureMoveoutResolutionCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ apertureKm, minSlownessSPerDeg, maxSlownessSPerDeg }) => {
      if (!(apertureKm > 0))
        simpleError("apertureKm", "Array aperture must be positive.");
      if (maxSlownessSPerDeg < minSlownessSPerDeg)
        simpleError(
          "maxSlownessSPerDeg",
          "Maximum slowness must not be below minimum slowness.",
        );
      const degToKm = 111.195;
      const tMin = apertureKm * (minSlownessSPerDeg / degToKm);
      const tMax = apertureKm * (maxSlownessSPerDeg / degToKm);
      return {
        moveoutSpanS: tMax - tMin,
        resolvable: tMax - tMin >= 0.05,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Check whether array aperture resolves the expected moveout across the slowness band.",
  id: "seismology/array-aperture-moveout-resolution-checker",
  inputs: [
    {
      minimum: 0,
      description: "Array aperture.",
      id: "apertureKm",
      kind: "number",
      label: "L",
      unit: "km",
    },
    {
      minimum: 0,
      description: "Fastest apparent velocity slowness.",
      id: "minSlownessSPerDeg",
      kind: "number",
      label: "p_min",
      unit: "s/°",
    },
    {
      minimum: 0,
      description: "Slowest slowness of interest.",
      id: "maxSlownessSPerDeg",
      kind: "number",
      label: "p_max",
      unit: "s/°",
    },
  ],
  outputs: [
    {
      description: "Moveout difference across the band.",
      id: "moveoutSpanS",
      kind: "number",
      label: "Δt",
      unit: "s",
    },
    {
      description: "Whether span exceeds one sample at 20 Hz.",
      id: "resolvable",
      kind: "boolean",
      label: "Resolves?",
    },
  ],
  title: "Array Aperture Moveout Resolution Checker",
});
export const runArrayApertureMoveoutResolutionChecker =
  arrayApertureMoveoutResolutionCheckerTool.execute;
export { arrayApertureMoveoutResolutionCheckerExample as example };
export default arrayApertureMoveoutResolutionCheckerTool;
