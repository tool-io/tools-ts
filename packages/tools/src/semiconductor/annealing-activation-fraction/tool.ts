import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AnnealActivationFractionInput = {
  readonly activationRatePerHour: number;
  readonly annealHours: number;
};

export type AnnealActivationFractionOutput = {
  readonly activatedFraction: number;
};

export const annealActivationFractionExample = {
  input: { activationRatePerHour: 0.25, annealHours: 4 },
  output: { activatedFraction: 0.6321205588285577 },
} satisfies ToolExample<
  AnnealActivationFractionInput,
  AnnealActivationFractionOutput
>;

export const calculateAnnealActivationFraction = (
  input: AnnealActivationFractionInput,
): AnnealActivationFractionOutput => {
  const activationRatePerHour = input.activationRatePerHour;
  const annealHours = input.annealHours;

  if (!Number.isFinite(activationRatePerHour) || activationRatePerHour < 0)
    simpleError(
      "activationRatePerHour",
      "Activation rate must be a finite number at least 0.",
      "invalid_activation_rate",
    );
  if (!Number.isFinite(annealHours) || annealHours < 0)
    simpleError(
      "annealHours",
      "Anneal time must be a finite number at least 0.",
      "invalid_anneal_time",
    );

  const exposure = activationRatePerHour * annealHours;
  if (exposure === 0 && activationRatePerHour > 0 && annealHours > 0)
    simpleError(
      "annealHours",
      "Activation exposure is positive but too small to represent.",
      "numeric_underflow",
    );

  // expm1 preserves small activation fractions that 1 - exp(-x) rounds to 0.
  const activatedFraction = -Math.expm1(-exposure);
  if (!Number.isFinite(activatedFraction))
    simpleError(
      "annealHours",
      "Activated fraction could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  // Clamp tiny negative due to floating error and normalize -0
  const normalized =
    activatedFraction === 0
      ? 0
      : activatedFraction < 0 && activatedFraction > -1e-15
        ? 0
        : activatedFraction > 1 && activatedFraction < 1 + 1e-15
          ? 1
          : activatedFraction;

  return { activatedFraction: normalized === 0 ? 0 : normalized };
};

export const annealActivationFractionTool = createSimpleTool({
  calculate: (input) =>
    calculateAnnealActivationFraction({
      activationRatePerHour: input.activationRatePerHour as number,
      annealHours: input.annealHours as number,
    }),
  description:
    "Compute the fraction of dopant activated by an anneal from a first-order activation rate and anneal duration. Fraction = 1 - exp(-rate × time).",
  id: "semiconductor/annealing-activation-fraction",
  inputs: [
    {
      description:
        "First-order dopant activation rate constant. Must be at least 0 per hour; 0 yields 0 activation.",
      id: "activationRatePerHour",
      kind: "number",
      label: "Activation rate",
      minimum: 0,
      unit: "1/hour",
    },
    {
      description:
        "Duration of the anneal. Must be at least 0 hour; 0 yields 0 activation.",
      id: "annealHours",
      kind: "number",
      label: "Anneal time",
      minimum: 0,
      unit: "hour",
    },
  ],
  outputs: [
    {
      description:
        "Fraction of the introduced dopant that is electrically active, between 0 and 1 inclusive. 0 means none activated, 1 means fully activated.",
      id: "activatedFraction",
      kind: "number",
      label: "Activated fraction",
      maximum: 1,
      minimum: 0,
    },
  ],
  title: "Anneal Activation Fraction Calculator",
});
export const runAnnealActivationFraction = annealActivationFractionTool.execute;
export default annealActivationFractionTool;
