import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MadelungConstantInput = {
  readonly crystalStructure: string;
};

export type MadelungConstantOutput = {
  readonly madelungConstant: number;
};

export const madelungConstantExample = {
  input: { crystalStructure: "rock-salt" },
  output: { madelungConstant: 1.7476 },
} satisfies ToolExample<MadelungConstantInput, MadelungConstantOutput>;

const madelungConstants = {
  "cesium-chloride": 1.7627,
  fluorite: 2.5194,
  "rock-salt": 1.7476,
  rutile: 2.408,
  wurtzite: 1.6413,
  "zinc-blende": 1.6381,
} as const;

export const calculateMadelungConstant = (
  input: MadelungConstantInput,
): MadelungConstantOutput => ({
  madelungConstant:
    madelungConstants[input.crystalStructure as keyof typeof madelungConstants],
});

export const MadelungConstantTool = createSimpleTool({
  calculate: (input) =>
    calculateMadelungConstant(input as unknown as MadelungConstantInput),
  description:
    "Look up the electrostatic Madelung constant for common ionic crystal structures.",
  id: "chemistry/madelung-constant",
  inputs: [
    {
      description: "Lattice arrangement of the ionic crystal.",
      enum: [
        "cesium-chloride",
        "fluorite",
        "rock-salt",
        "rutile",
        "wurtzite",
        "zinc-blende",
      ],
      id: "crystalStructure",
      kind: "string",
      label: "Crystal structure",
    },
  ],
  outputs: [
    {
      description: "Dimensionless Madelung constant of the lattice.",
      id: "madelungConstant",
      kind: "number",
      label: "Madelung constant",
    },
  ],
  title: "Madelung Constant Lookup",
});
export const runMadelungConstant = MadelungConstantTool.execute;
export default MadelungConstantTool;
