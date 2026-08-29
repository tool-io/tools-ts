import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cornerFrequencyStressDropConsistencyCheckerExample = {
  input: {
    claimedStressDropBar: 30,
    cornerFrequencyHz: 0.11480775093909207,
    seismicMomentNm: 1e19,
  },
  output: { consistentWithinFactorTwo: true, invertedStressDropBar: 30 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const cornerFrequencyStressDropConsistencyCheckerTool = createSimpleTool(
  {
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({
        claimedStressDropBar,
        cornerFrequencyHz,
        seismicMomentNm,
        betaKmS,
      }) => {
        if (!(cornerFrequencyHz > 0))
          simpleError(
            "cornerFrequencyHz",
            "Corner frequency must be positive.",
          );
        if (!(seismicMomentNm > 0))
          simpleError("seismicMomentNm", "Moment must be positive.");
        if (!(betaKmS > 0))
          simpleError("betaKmS", "Shear velocity must be positive.");
        if (!(claimedStressDropBar > 0))
          simpleError(
            "claimedStressDropBar",
            "Claimed stress drop must be positive.",
          );
        // Brune inverse in SI: Δσ[Pa] = M0[N·m]·(fc/(0.49·β[m/s]))³
        const betaMS = betaKmS * 1000;
        const stressDropPa =
          seismicMomentNm * (cornerFrequencyHz / (0.49 * betaMS)) ** 3;
        const inverted = stressDropPa / 1e5;
        return {
          invertedStressDropBar: inverted,
          consistentWithinFactorTwo:
            inverted >= claimedStressDropBar / 2 &&
            inverted <= claimedStressDropBar * 2,
        };
      })(input as never) as Record<string, unknown>,
    description:
      "Invert the Brune relation fc = 0.49·β·(Δσ/M₀)^(1/3) for stress drop Δσ = M₀·(fc/(0.49·β))³ given the moment and compare with a claimed Δσ; no rigidity term is needed because Δσ/M₀ replaces it.",
    id: "seismology/corner-frequency-stress-drop-consistency-checker",
    inputs: [
      {
        minimum: 0,
        description: "Observed corner frequency.",
        id: "cornerFrequencyHz",
        kind: "number",
        label: "f_c",
        unit: "Hz",
      },
      {
        minimum: 0,
        description: "Seismic moment.",
        id: "seismicMomentNm",
        kind: "number",
        label: "M₀",
        unit: "N·m",
      },
      {
        minimum: 0,
        description: "Claimed stress drop.",
        id: "claimedStressDropBar",
        kind: "number",
        label: "Δσ_claim",
        unit: "bar",
      },
      {
        default: 3.5,
        description: "Shear velocity.",
        id: "betaKmS",
        kind: "number",
        label: "β",
        unit: "km/s",
      },
    ],
    outputs: [
      {
        description: "Stress drop implied by fc and M₀.",
        id: "invertedStressDropBar",
        kind: "number",
        label: "Δσ_inv",
        unit: "bar",
      },
      {
        description: "Whether inverted value is within a factor of two.",
        id: "consistentWithinFactorTwo",
        kind: "boolean",
        label: "Consistent?",
      },
    ],
    title: "Corner Frequency Stress Drop Consistency Checker",
  },
);
export const runCornerFrequencyStressDropConsistencyChecker =
  cornerFrequencyStressDropConsistencyCheckerTool.execute;
export { cornerFrequencyStressDropConsistencyCheckerExample as example };
export default cornerFrequencyStressDropConsistencyCheckerTool;
