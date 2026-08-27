import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CorePorosityHeliumInput = {
  readonly bulkVolumeCm3: number;
  readonly grainVolumeCm3: number;
};

export type CorePorosityHeliumOutput = {
  readonly poreVolumeCm3: number;
  readonly porosity: number;
};

export const calculateCorePorosityHelium = (
  input: CorePorosityHeliumInput,
): CorePorosityHeliumOutput => {
  if (!(input.bulkVolumeCm3 > 0))
    simpleError(
      "bulkVolumeCm3",
      "Bulk volume must be positive.",
      "invalid_volume",
    );
  if (!(input.grainVolumeCm3 > 0))
    simpleError(
      "grainVolumeCm3",
      "Grain volume must be positive.",
      "invalid_volume",
    );
  if (input.grainVolumeCm3 > input.bulkVolumeCm3)
    simpleError(
      "grainVolumeCm3",
      "Grain volume cannot exceed bulk volume.",
      "invalid_volume",
    );
  const poreVolumeCm3 = input.bulkVolumeCm3 - input.grainVolumeCm3;
  return { poreVolumeCm3, porosity: poreVolumeCm3 / input.bulkVolumeCm3 };
};

export const corePorosityHeliumExample = {
  input: { bulkVolumeCm3: 12.5, grainVolumeCm3: 9.375 },
  output: { poreVolumeCm3: 3.125, porosity: 0.25 },
} satisfies ToolExample<CorePorosityHeliumInput, CorePorosityHeliumOutput>;

export const corePorosityHeliumTool = createSimpleTool({
  id: "geology/core-porosity-helium",
  title: "Core Porosity Helium Calculator",
  description:
    "Compute helium-pycnometry porosity from bulk volume and helium-measured grain volume, both in cubic centimetres.",
  inputs: [
    {
      description: "Bulk volume of the plug in cubic centimetres.",
      id: "bulkVolumeCm3",
      kind: "number",
      label: "Bulk volume",
    },
    {
      description: "Helium grain volume of the plug in cubic centimetres.",
      id: "grainVolumeCm3",
      kind: "number",
      label: "Grain volume",
    },
  ],
  outputs: [
    {
      description: "Pore volume in cubic centimetres.",
      id: "poreVolumeCm3",
      kind: "number",
      label: "Pore volume",
    },
    {
      description: "Porosity as a volume fraction.",
      id: "porosity",
      kind: "number",
      label: "Porosity",
    },
  ],
  calculate: (input) =>
    calculateCorePorosityHelium(input as unknown as CorePorosityHeliumInput),
});

export const runCorePorosityHelium = corePorosityHeliumTool.execute;
export default corePorosityHeliumTool;
