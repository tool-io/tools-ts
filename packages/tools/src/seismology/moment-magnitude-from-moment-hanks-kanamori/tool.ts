import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const momentMagnitudeFromMomentHanksKanamoriExample = {
  input: { seismicMomentNm: 10000000000000000000 },
  output: { momentMagnitudeMw: 6.6, energyClassNote: "strong" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const momentMagnitudeFromMomentHanksKanamoriTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ seismicMomentNm }) => {
      if (!(seismicMomentNm > 0))
        simpleError("seismicMomentNm", "Seismic moment must be positive.");
      const mw = (2 / 3) * (Math.log10(seismicMomentNm) - 9.1);
      return {
        momentMagnitudeMw: mw,
        energyClassNote:
          mw < 4
            ? "light"
            : mw < 6
              ? "moderate"
              : mw < 7
                ? "strong"
                : mw < 8
                  ? "major"
                  : "great",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Convert seismic moment to moment magnitude: M_w = (2/3)(log₁₀M₀ − 9.1).",
  id: "seismology/moment-magnitude-from-moment-hanks-kanamori",
  inputs: [
    {
      minimum: 0,
      description: "Seismic moment.",
      id: "seismicMomentNm",
      kind: "number",
      label: "M₀",
      unit: "N·m",
    },
  ],
  outputs: [
    {
      description: "Moment magnitude.",
      id: "momentMagnitudeMw",
      kind: "number",
      label: "M_w",
    },
    {
      description: "Size class note.",
      id: "energyClassNote",
      kind: "string",
      label: "Class",
    },
  ],
  title: "Moment Magnitude From Moment Hanks Kanamori",
});
export const runMomentMagnitudeFromMomentHanksKanamori =
  momentMagnitudeFromMomentHanksKanamoriTool.execute;
export { momentMagnitudeFromMomentHanksKanamoriExample as example };
export default momentMagnitudeFromMomentHanksKanamoriTool;
