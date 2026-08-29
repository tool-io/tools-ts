import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wadatiOriginTimeSingleStationFormulaExample = {
  input: {
    pArrivalSeconds: 100,
    sArrivalSeconds: 136.60254037844385,
    velocityRatioR: 1.7320508075688772,
  },
  output: {
    originTimeSeconds:
      (1.7320508075688772 * 100 - 136.60254037844385) /
      (1.7320508075688772 - 1),
    spIntervalSeconds: 136.60254037844385 - 100,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const wadatiOriginTimeSingleStationFormulaTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ pArrivalSeconds, sArrivalSeconds, velocityRatioR }) => {
      if (velocityRatioR <= 1)
        simpleError("velocityRatioR", "R must exceed one.");
      if (sArrivalSeconds <= pArrivalSeconds)
        simpleError(
          "sArrivalSeconds",
          "S arrival must be later than P arrival.",
        );
      const originTimeSeconds =
        (velocityRatioR * pArrivalSeconds - sArrivalSeconds) /
        (velocityRatioR - 1);
      return {
        originTimeSeconds,
        spIntervalSeconds: sArrivalSeconds - pArrivalSeconds,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Origin-time estimate from one station using the Wadati ratio: t₀ = (R·t_p − t_s)/(R − 1).",
  id: "seismology/wadati-origin-time-single-station-formula",
  inputs: [
    {
      description: "P arrival time (epoch seconds).",
      id: "pArrivalSeconds",
      kind: "number",
      label: "t_p",
    },
    {
      description: "S arrival time (epoch seconds).",
      id: "sArrivalSeconds",
      kind: "number",
      label: "t_s",
    },
    {
      minimum: 0,
      description: "Vp/Vs.",
      id: "velocityRatioR",
      kind: "number",
      label: "R",
    },
  ],
  outputs: [
    {
      description: "Estimated origin time.",
      id: "originTimeSeconds",
      kind: "number",
      label: "t₀",
      unit: "s",
    },
    {
      description: "S−P interval used.",
      id: "spIntervalSeconds",
      kind: "number",
      label: "Δt",
      unit: "s",
    },
  ],
  title: "Wadati Origin Time Single Station Formula Calculator",
});
export const runWadatiOriginTimeSingleStationFormula =
  wadatiOriginTimeSingleStationFormulaTool.execute;
export { wadatiOriginTimeSingleStationFormulaExample as example };
export default wadatiOriginTimeSingleStationFormulaTool;
