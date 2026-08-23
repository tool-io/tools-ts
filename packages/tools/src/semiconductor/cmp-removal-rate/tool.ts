import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CmpRemovalRateInput = {
  readonly pressurePsi: number;
  readonly padSpeedRpm: number;
  readonly prestonCoefficient?: number;
};

export type CmpRemovalRateOutput = {
  readonly removalNmPerMin: number;
};

export const cmpRemovalRateExample = {
  input: { pressurePsi: 5, padSpeedRpm: 40 },
  output: { removalNmPerMin: 4 },
} satisfies ToolExample<CmpRemovalRateInput, CmpRemovalRateOutput>;

export const calculateCmpRemovalRate = (
  input: CmpRemovalRateInput,
): CmpRemovalRateOutput => {
  const pressurePsi = input.pressurePsi;
  const padSpeedRpm = input.padSpeedRpm;
  const prestonCoefficient = input.prestonCoefficient ?? 0.02;

  if (!Number.isFinite(pressurePsi) || pressurePsi <= 0)
    simpleError(
      "pressurePsi",
      "Polishing pressure must be a finite positive number.",
      "degenerate_input",
    );
  if (!Number.isFinite(padSpeedRpm) || padSpeedRpm <= 0)
    simpleError(
      "padSpeedRpm",
      "Pad speed must be a finite positive number.",
      "degenerate_input",
    );
  if (!Number.isFinite(prestonCoefficient) || prestonCoefficient < 0)
    simpleError(
      "prestonCoefficient",
      "Preston coefficient must be a finite number at least 0.",
      "invalid_preston_coefficient",
    );

  let removalNmPerMin = prestonCoefficient * pressurePsi * padSpeedRpm;
  if (
    prestonCoefficient > 0 &&
    (!Number.isFinite(removalNmPerMin) || removalNmPerMin === 0)
  )
    removalNmPerMin = Math.exp(
      Math.log(prestonCoefficient) +
        Math.log(pressurePsi) +
        Math.log(padSpeedRpm),
    );
  if (
    !Number.isFinite(removalNmPerMin) ||
    (prestonCoefficient > 0 && removalNmPerMin <= 0)
  )
    simpleError(
      "prestonCoefficient",
      "Removal rate is outside the finite numeric range.",
      "numeric_range",
    );
  // Normalize -0 to +0
  return {
    removalNmPerMin: removalNmPerMin === 0 ? 0 : removalNmPerMin,
  };
};

export const cmpRemovalRateTool = createSimpleTool({
  calculate: (input) =>
    calculateCmpRemovalRate({
      padSpeedRpm: input.padSpeedRpm as number,
      prestonCoefficient:
        (input.prestonCoefficient as number | undefined) ?? undefined,
      pressurePsi: input.pressurePsi as number,
    }),
  description:
    "Compute the chemical mechanical polishing removal rate from the linear Preston equation.",
  id: "semiconductor/cmp-removal-rate",
  inputs: [
    {
      description:
        "Downward polishing pressure applied to the wafer. Must be greater than 0 psi.",
      id: "pressurePsi",
      kind: "number",
      label: "Polishing pressure",
      minimum: Number.MIN_VALUE,
      unit: "psi",
    },
    {
      description:
        "Pad rotational speed used to calibrate the coefficient. Must be greater than 0 rpm; rpm is not linear surface velocity.",
      id: "padSpeedRpm",
      kind: "number",
      label: "Pad speed",
      minimum: Number.MIN_VALUE,
      unit: "rpm",
    },
    {
      default: 0.02,
      description:
        "Preston proportionality coefficient for the pad and slurry system. Must be at least 0.",
      id: "prestonCoefficient",
      kind: "number",
      label: "Preston coefficient",
      minimum: 0,
      unit: "nm/(psi*rpm)",
    },
  ],
  outputs: [
    {
      description: "Linear Preston material removal rate.",
      id: "removalNmPerMin",
      kind: "number",
      label: "Removal rate",
      minimum: 0,
      unit: "nm/min",
    },
  ],
  title: "CMP Preston Removal Rate Calculator",
});
export const runCmpRemovalRate = cmpRemovalRateTool.execute;
export default cmpRemovalRateTool;
