import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CasingTensionInput = {
  readonly casingLinearWeightNewtonsPerMetre: number;
  readonly suspendedLengthMetres: number;
  readonly mudDensityKilogramsPerCubicMetre?: number;
  readonly steelDensityKilogramsPerCubicMetre?: number;
};

export type CasingTensionOutput = {
  readonly buoyancyFactor: number;
  readonly airWeightKilonewtons: number;
  readonly effectiveTensionKilonewtons: number;
};

export const calculateCasingTension = (
  input: CasingTensionInput,
): CasingTensionOutput => {
  const mud = input.mudDensityKilogramsPerCubicMetre ?? 0;
  const steel = input.steelDensityKilogramsPerCubicMetre ?? 7850;
  if (!(input.casingLinearWeightNewtonsPerMetre > 0))
    return simpleError(
      "casingLinearWeightNewtonsPerMetre",
      "Casing linear weight must be greater than zero.",
      "invalid_weight",
    );
  if (!(input.suspendedLengthMetres > 0))
    return simpleError(
      "suspendedLengthMetres",
      "Suspended length must be greater than zero.",
      "invalid_length",
    );
  if (!(steel > 0))
    return simpleError(
      "steelDensityKilogramsPerCubicMetre",
      "Steel density must be greater than zero.",
      "invalid_density",
    );
  if (!(mud >= 0 && mud < steel))
    return simpleError(
      "mudDensityKilogramsPerCubicMetre",
      "Mud density must be non-negative and below the steel density.",
      "invalid_density",
    );
  const buoyancyFactor = 1 - mud / steel;
  const airWeight =
    (input.casingLinearWeightNewtonsPerMetre * input.suspendedLengthMetres) /
    1000;
  return {
    buoyancyFactor,
    airWeightKilonewtons: airWeight,
    effectiveTensionKilonewtons:
      (buoyancyFactor *
        input.casingLinearWeightNewtonsPerMetre *
        input.suspendedLengthMetres) /
      1000,
  };
};

export const casingTensionExample = {
  input: {
    casingLinearWeightNewtonsPerMetre: 792,
    suspendedLengthMetres: 3000,
    mudDensityKilogramsPerCubicMetre: 1200,
  },
  output: {
    buoyancyFactor: 0.8471337579617835,
    airWeightKilonewtons: 2376,
    effectiveTensionKilonewtons: 2012.7898089171977,
  },
} satisfies ToolExample<CasingTensionInput, CasingTensionOutput>;

export const casingTensionTool = createSimpleTool({
  id: "geology/casing-tension",
  title: "Casing Tension Calculator",
  description:
    "Compute the effective axial tension at surface for suspended casing, including the buoyancy effect of drilling fluid.",
  inputs: [
    {
      description: "Linear weight of the casing string in newtons per metre.",
      id: "casingLinearWeightNewtonsPerMetre",
      kind: "number",
      label: "Linear weight",
    },
    {
      description: "Suspended casing length in metres.",
      id: "suspendedLengthMetres",
      kind: "number",
      label: "Length",
    },
    {
      default: 0,
      description:
        "Drilling fluid density in kilograms per cubic metre (0 disables buoyancy).",
      id: "mudDensityKilogramsPerCubicMetre",
      kind: "number",
      label: "Mud density",
      minimum: 0,
    },
    {
      default: 7850,
      description: "Steel density in kilograms per cubic metre.",
      id: "steelDensityKilogramsPerCubicMetre",
      kind: "number",
      label: "Steel density",
    },
  ],
  outputs: [
    {
      description: "Archimedes buoyancy factor applied to the string weight.",
      id: "buoyancyFactor",
      kind: "number",
      label: "Buoyancy factor",
    },
    {
      description: "String weight in air in kilonewtons.",
      id: "airWeightKilonewtons",
      kind: "number",
      label: "Air weight",
    },
    {
      description: "Buoyed effective tension at surface in kilonewtons.",
      id: "effectiveTensionKilonewtons",
      kind: "number",
      label: "Effective tension",
    },
  ],
  calculate: (input) =>
    calculateCasingTension(input as unknown as CasingTensionInput),
});

export const runCasingTension = casingTensionTool.execute;
export default casingTensionTool;
