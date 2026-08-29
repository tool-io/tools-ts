import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const uniformHazardSpectrumInterpolationExample = {
  input: {
    anchorPeriodsS: [0.2, 1, 2],
    anchorSaG: [0.5, 0.25, 0.12],
    targetPeriodS: 0.5,
  },
  output: { saG: 0.33696637900918913, bracketedByAnchors: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const uniformHazardSpectrumInterpolationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ anchorPeriodsS, anchorSaG, targetPeriodS }) => {
      const ts = anchorPeriodsS as unknown[];
      const sa = anchorSaG as unknown[];
      if (
        !Array.isArray(ts) ||
        !Array.isArray(sa) ||
        ts.length !== sa.length ||
        ts.length < 2
      )
        simpleError("anchorPeriodsS", "Provide matching ascending anchors.");
      const T = ts as number[];
      const S = sa as number[];
      if (
        T.some((value) => value <= 0) ||
        S.some((value) => value <= 0) ||
        T.some((value, index) => index > 0 && value <= T[index - 1])
      )
        simpleError(
          "anchorPeriodsS",
          "Periods and ordinates must be positive, with periods strictly ascending.",
        );
      if (!(targetPeriodS > 0))
        simpleError("targetPeriodS", "Target period must be positive.");
      const bracketedByAnchors =
        targetPeriodS >= T[0] && targetPeriodS <= T[T.length - 1];
      let i = 1;
      while (i < T.length && T[i] < targetPeriodS) i++;
      if (!bracketedByAnchors)
        simpleError(
          "targetPeriodS",
          "Target period outside the anchored range.",
        );
      const w =
        (Math.log(targetPeriodS) - Math.log(T[i - 1])) /
        (Math.log(T[i]) - Math.log(T[i - 1]));
      return {
        saG: Math.exp(
          Math.log(S[i - 1]) + w * (Math.log(S[i]) - Math.log(S[i - 1])),
        ),
        bracketedByAnchors,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Log-log interpolated UHS ordinate at an arbitrary period from anchor ordinates.",
  id: "seismology/uniform-hazard-spectrum-interpolation",
  inputs: [
    {
      description: "Anchor periods (ascending).",
      id: "anchorPeriodsS",
      kind: "numberList",
      label: "T_i",
    },
    {
      description: "Anchor spectral accelerations (g).",
      id: "anchorSaG",
      kind: "numberList",
      label: "Sa_i",
    },
    {
      minimum: 0,
      description: "Target period.",
      id: "targetPeriodS",
      kind: "number",
      label: "T*",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Interpolated spectral acceleration.",
      id: "saG",
      kind: "number",
      label: "Sa(T*)",
      unit: "g",
    },
    {
      description: "Whether the target lies inside the anchor range.",
      id: "bracketedByAnchors",
      kind: "boolean",
      label: "Inside",
    },
  ],
  title: "Uniform Hazard Spectrum Interpolation Calculator",
});
export const runUniformHazardSpectrumInterpolation =
  uniformHazardSpectrumInterpolationTool.execute;
export { uniformHazardSpectrumInterpolationExample as example };
export default uniformHazardSpectrumInterpolationTool;
