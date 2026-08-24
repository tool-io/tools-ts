import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const BOLTZMANN_EV_PER_K = 8.617333262e-5;

export type ElectromigrationBlackEquationInput = {
  readonly activationEnergyEv?: number;
  readonly blackPrefactor: number;
  readonly currentDensityAPerCm2: number;
  readonly exponentN?: number;
  readonly temperatureKelvin: number;
};

export type ElectromigrationBlackEquationOutput = {
  readonly medianTimeToFailureHours: number;
};

export const electromigrationBlackEquationExample = {
  input: {
    blackPrefactor: 1_000_000,
    currentDensityAPerCm2: 1_000_000,
    temperatureKelvin: 378,
  },
  output: { medianTimeToFailureHours: 2152.3979294425553 },
} satisfies ToolExample<
  ElectromigrationBlackEquationInput,
  ElectromigrationBlackEquationOutput
>;

export const calculateElectromigrationBlackEquation = (
  input: ElectromigrationBlackEquationInput,
): ElectromigrationBlackEquationOutput => {
  const activationEnergyEv = input.activationEnergyEv ?? 0.7;
  const exponentN = input.exponentN ?? 2;
  const values: ReadonlyArray<
    readonly [keyof ElectromigrationBlackEquationInput, number, string]
  > = [
    ["blackPrefactor", input.blackPrefactor, "Black prefactor"],
    ["currentDensityAPerCm2", input.currentDensityAPerCm2, "Current density"],
    ["exponentN", exponentN, "Current-density exponent"],
    ["activationEnergyEv", activationEnergyEv, "Activation energy"],
    ["temperatureKelvin", input.temperatureKelvin, "Temperature"],
  ];
  for (const [field, value, label] of values)
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        field,
        `${label} must be a finite number greater than zero.`,
        "invalid_value",
      );

  const directResult =
    input.blackPrefactor *
    input.currentDensityAPerCm2 ** -exponentN *
    Math.exp(
      activationEnergyEv / (BOLTZMANN_EV_PER_K * input.temperatureKelvin),
    );
  if (Number.isFinite(directResult) && directResult > 0)
    return { medianTimeToFailureHours: directResult };

  const logMttf =
    Math.log(input.blackPrefactor) -
    exponentN * Math.log(input.currentDensityAPerCm2) +
    activationEnergyEv / (BOLTZMANN_EV_PER_K * input.temperatureKelvin);
  const medianTimeToFailureHours = Math.exp(logMttf);
  if (!Number.isFinite(medianTimeToFailureHours))
    simpleError(
      "blackPrefactor",
      "The predicted lifetime is too large to represent.",
      "numeric_overflow",
    );
  if (medianTimeToFailureHours === 0)
    simpleError(
      "blackPrefactor",
      "The predicted lifetime is too small to represent.",
      "numeric_underflow",
    );
  return { medianTimeToFailureHours };
};

export const electromigrationBlackEquationTool = createSimpleTool({
  calculate: (input) =>
    calculateElectromigrationBlackEquation({
      activationEnergyEv:
        (input.activationEnergyEv as number | undefined) ?? undefined,
      blackPrefactor: input.blackPrefactor as number,
      currentDensityAPerCm2: input.currentDensityAPerCm2 as number,
      exponentN: (input.exponentN as number | undefined) ?? undefined,
      temperatureKelvin: input.temperatureKelvin as number,
    }),
  description:
    "Estimate electromigration median time to failure with Black's equation, MTTF = A J^-n exp(Ea/kBT).",
  id: "semiconductor/electromigration-black-equation",
  inputs: [
    {
      description:
        "Empirical prefactor A calibrated with current density expressed numerically in A/cm^2. Its dimensions depend on exponent n, so it must come from a compatible fit.",
      id: "blackPrefactor",
      kind: "number",
      label: "Black prefactor",
      minimum: Number.MIN_VALUE,
    },
    {
      description:
        "Conductor current density in amperes per square centimeter.",
      id: "currentDensityAPerCm2",
      kind: "number",
      label: "Current density",
      minimum: Number.MIN_VALUE,
      unit: "A/cm^2",
    },
    {
      default: 2,
      description:
        "Empirical current-density exponent n for the fitted failure mode.",
      id: "exponentN",
      kind: "number",
      label: "Current-density exponent",
      minimum: Number.MIN_VALUE,
    },
    {
      default: 0.7,
      description:
        "Activation energy Ea for the fitted electromigration mechanism.",
      id: "activationEnergyEv",
      kind: "number",
      label: "Activation energy",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      description: "Absolute conductor temperature.",
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature",
      minimum: Number.MIN_VALUE,
      unit: "K",
    },
  ],
  outputs: [
    {
      description:
        "Predicted median time to failure under the fitted conditions.",
      id: "medianTimeToFailureHours",
      kind: "number",
      label: "Median time to failure",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
  ],
  title: "Black Equation MTTF Calculator",
});
export const runElectromigrationBlackEquation =
  electromigrationBlackEquationTool.execute;
export default electromigrationBlackEquationTool;
