import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapillaryPressureBrooksCoreyInput = {
  readonly wettingPhaseSaturation: number;
  readonly entryPressurePa: number;
  readonly residualWettingSaturation?: number;
  readonly poreSizeDistributionIndex?: number;
};

export type CapillaryPressureBrooksCoreyOutput = {
  readonly effectiveSaturation: number;
  readonly capillaryPressurePa: number;
};

export const calculateCapillaryPressureBrooksCorey = (
  input: CapillaryPressureBrooksCoreyInput,
): CapillaryPressureBrooksCoreyOutput => {
  const residualWettingSaturation = input.residualWettingSaturation ?? 0;
  const poreSizeDistributionIndex = input.poreSizeDistributionIndex ?? 2;
  if (!(input.entryPressurePa > 0))
    simpleError(
      "entryPressurePa",
      "Entry pressure must be positive.",
      "invalid_pressure",
    );
  if (!(residualWettingSaturation >= 0 && residualWettingSaturation < 1))
    simpleError(
      "residualWettingSaturation",
      "Residual saturation must lie in the interval zero to one.",
      "invalid_saturation",
    );
  if (!(
    input.wettingPhaseSaturation > residualWettingSaturation &&
    input.wettingPhaseSaturation <= 1
  ))
    simpleError(
      "wettingPhaseSaturation",
      "Wetting saturation must exceed the residual saturation.",
      "invalid_saturation",
    );
  if (!(poreSizeDistributionIndex > 0))
    simpleError(
      "poreSizeDistributionIndex",
      "Pore size distribution index must be positive.",
      "invalid_exponent",
    );
  const effectiveSaturation =
    (input.wettingPhaseSaturation - residualWettingSaturation) /
    (1 - residualWettingSaturation);
  return {
    effectiveSaturation,
    capillaryPressurePa:
      input.entryPressurePa * effectiveSaturation ** -poreSizeDistributionIndex,
  };
};

export const capillaryPressureBrooksCoreyExample = {
  input: {
    wettingPhaseSaturation: 0.6,
    entryPressurePa: 500,
    residualWettingSaturation: 0.2,
  },
  output: {
    effectiveSaturation: 0.49999999999999994,
    capillaryPressurePa: 2000.0000000000005,
  },
} satisfies ToolExample<
  CapillaryPressureBrooksCoreyInput,
  CapillaryPressureBrooksCoreyOutput
>;

export const capillaryPressureBrooksCoreyTool = createSimpleTool({
  id: "geology/capillary-pressure-brooks-corey",
  title: "Capillary Pressure Brooks Corey Calculator",
  description:
    "Evaluate the Brooks-Corey capillary pressure curve Pc = Pe * Se^(-lambda) for a wetting-phase saturation.",
  inputs: [
    {
      description: "Wetting-phase saturation as a fraction.",
      id: "wettingPhaseSaturation",
      kind: "number",
      label: "Sw",
      maximum: 1,
    },
    {
      description: "Entry (displacement) pressure in pascals.",
      id: "entryPressurePa",
      kind: "number",
      label: "Pe",
    },
    {
      default: 0,
      description: "Residual wetting-phase saturation as a fraction.",
      id: "residualWettingSaturation",
      kind: "number",
      label: "Sr",
    },
    {
      default: 2,
      description: "Pore size distribution index lambda.",
      id: "poreSizeDistributionIndex",
      kind: "number",
      label: "Lambda",
    },
  ],
  outputs: [
    {
      description: "Effective saturation Se as a fraction.",
      id: "effectiveSaturation",
      kind: "number",
      label: "Se",
    },
    {
      description: "Capillary pressure in pascals.",
      id: "capillaryPressurePa",
      kind: "number",
      label: "Pc",
    },
  ],
  calculate: (input) =>
    calculateCapillaryPressureBrooksCorey(
      input as unknown as CapillaryPressureBrooksCoreyInput,
    ),
});

export const runCapillaryPressureBrooksCorey =
  capillaryPressureBrooksCoreyTool.execute;
export default capillaryPressureBrooksCoreyTool;
