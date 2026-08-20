import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type DiffusionCapacitanceInput = {
  readonly forwardCurrentMa: number;
  readonly lifetimeNs: number;
  readonly idealityFactor?: number;
  readonly temperatureK?: number;
};

export type DiffusionCapacitanceOutput = {
  readonly capacitanceNanoF: number;
};

const BOLTZMANN_J_PER_K = 1.380649e-23;
const ELEMENTARY_CHARGE_C = 1.602176634e-19;

export const diffusionCapacitanceExample = {
  input: {
    forwardCurrentMa: 1,
    idealityFactor: 1,
    lifetimeNs: 100,
  },
  output: { capacitanceNanoF: 3.86817270718 },
} satisfies ToolExample<DiffusionCapacitanceInput, DiffusionCapacitanceOutput>;

export const calculateDiffusionCapacitance = (
  input: DiffusionCapacitanceInput,
): DiffusionCapacitanceOutput => {
  const ideality = input.idealityFactor ?? 1;
  const temperatureK = input.temperatureK ?? 300;
  if (ideality < 1)
    simpleError(
      "idealityFactor",
      "The ideality factor cannot be below one.",
      "invalid_ideality",
    );
  if (temperatureK <= 0)
    simpleError(
      "temperatureK",
      "Temperature must be positive.",
      "invalid_temperature",
    );
  if (input.lifetimeNs <= 0 || input.forwardCurrentMa < 0)
    simpleError(
      "lifetimeNs",
      "Lifetime must be positive and current nonnegative.",
      "invalid_input",
    );
  const thermalVoltage = (BOLTZMANN_J_PER_K * temperatureK) / ELEMENTARY_CHARGE_C;
  const farads =
    ((input.lifetimeNs * 1e-9) * (input.forwardCurrentMa * 1e-3)) /
    (ideality * thermalVoltage);
  return { capacitanceNanoF: roundStatistic(farads * 1e9) };
};

export const diffusionCapacitanceTool = createSimpleTool({
  calculate: (input) =>
    calculateDiffusionCapacitance(
      input as unknown as DiffusionCapacitanceInput,
    ),
  description:
    "Compute the diffusion capacitance of a forward-biased diode from stored-charge lifetime and current.",
  id: "semiconductor/diffusion-capacitance",
  inputs: [
    {
      description: "Forward bias current.",
      id: "forwardCurrentMa",
      kind: "number",
      label: "Forward current",
      unit: "mA",
    },
    {
      description: "Minority-carrier lifetime.",
      id: "lifetimeNs",
      kind: "number",
      label: "Lifetime",
      unit: "ns",
    },
    {
      default: 1,
      description: "Diode ideality factor.",
      id: "idealityFactor",
      kind: "number",
      label: "Ideality factor",
      minimum: 1,
    },
    {
      default: 300,
      description: "Device temperature.",
      id: "temperatureK",
      kind: "number",
      label: "Temperature",
      unit: "K",
    },
  ],
  outputs: [
    {
      description: "Diffusion capacitance.",
      format: "capacitance-nf",
      id: "capacitanceNanoF",
      kind: "number",
      label: "Capacitance",
      unit: "nF",
    },
  ],
  title: "Diffusion Capacitance Calculator",
});
export const runDiffusionCapacitance = diffusionCapacitanceTool.execute;
export default diffusionCapacitanceTool;
