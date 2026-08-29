import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const groupVsPhaseVelocityDifferenceExample = {
  input: { phaseVelocityKmS: 3.6, wavelengthKm: 72, dcPerDlambda: 0.01 },
  output: { groupVelocityKmS: 2.88, differenceKmS: 2.88 - 3.6 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const groupVsPhaseVelocityDifferenceTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ phaseVelocityKmS, wavelengthKm, dcPerDlambda }) => {
      if (phaseVelocityKmS <= 0)
        simpleError("phaseVelocityKmS", "Phase velocity must be positive.");
      const groupVelocityKmS = phaseVelocityKmS - wavelengthKm * dcPerDlambda;
      if (groupVelocityKmS <= 0)
        simpleError(
          "dcPerDlambda",
          "The supplied dispersion gradient produces a non-positive group velocity.",
        );
      return {
        groupVelocityKmS,
        differenceKmS: groupVelocityKmS - phaseVelocityKmS,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Group velocity U = c − λ·dc/dλ from phase velocity and its wavelength gradient.",
  id: "seismology/group-vs-phase-velocity-difference",
  inputs: [
    {
      minimum: 0,
      description: "Phase velocity.",
      id: "phaseVelocityKmS",
      kind: "number",
      label: "c",
      unit: "km/s",
    },
    {
      minimum: 0,
      description: "Wavelength.",
      id: "wavelengthKm",
      kind: "number",
      label: "λ",
      unit: "km",
    },
    {
      description: "Gradient of c with wavelength.",
      id: "dcPerDlambda",
      kind: "number",
      label: "dc/dλ",
      unit: "(km/s)/km",
    },
  ],
  outputs: [
    {
      description: "Group velocity.",
      id: "groupVelocityKmS",
      kind: "number",
      label: "U",
      unit: "km/s",
    },
    {
      description: "Group minus phase velocity.",
      id: "differenceKmS",
      kind: "number",
      label: "U−c",
      unit: "km/s",
    },
  ],
  title: "Group vs Phase Velocity Difference Calculator",
});
export const runGroupVsPhaseVelocityDifference =
  groupVsPhaseVelocityDifferenceTool.execute;
export { groupVsPhaseVelocityDifferenceExample as example };
export default groupVsPhaseVelocityDifferenceTool;
