import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecompactedThicknessInput = {
  readonly compactedThicknessM: number;
  readonly porosityFraction: number;
  readonly targetPorosityFraction?: number;
};

export type DecompactedThicknessOutput = {
  readonly decompactedThicknessM: number;
};

export const calculateDecompactedThickness = (
  input: DecompactedThicknessInput,
): DecompactedThicknessOutput => {
  const compactedThicknessM = input.compactedThicknessM;
  const porosityFraction = input.porosityFraction;
  const targetPorosityFraction = input.targetPorosityFraction ?? 0;
  if (!(compactedThicknessM >= 0))
    simpleError(
      "compactedThicknessM",
      "Compacted thickness must be non-negative.",
      "invalid_thickness",
    );
  if (!(porosityFraction >= 0 && porosityFraction < 1))
    simpleError(
      "porosityFraction",
      "Present porosity must be at least 0 and below 1.",
      "invalid_porosity",
    );
  if (!(targetPorosityFraction >= 0 && targetPorosityFraction < 1))
    simpleError(
      "targetPorosityFraction",
      "Target porosity must be at least 0 and below 1.",
      "invalid_porosity",
    );
  return {
    decompactedThicknessM:
      (compactedThicknessM * (1 - porosityFraction)) /
      (1 - targetPorosityFraction),
  };
};

export const decompactedThicknessExample = {
  input: {
    compactedThicknessM: 900,
    porosityFraction: 0.4,
    targetPorosityFraction: 0,
  },
  output: { decompactedThicknessM: 540 },
} satisfies ToolExample<DecompactedThicknessInput, DecompactedThicknessOutput>;

export const decompactedThicknessTool = createSimpleTool({
  id: "geology/decompacted-thickness",
  title: "Decompacted Thickness Calculator",
  description:
    "Grain-volume-conserving decompaction of a compacted unit: t' = t * (1 - porosity) / (1 - target porosity). Porosities are fractions.",
  inputs: [
    {
      description: "Present-day (compacted) thickness in metres.",
      id: "compactedThicknessM",
      kind: "number",
      label: "Compacted thickness",
      unit: "m",
    },
    {
      description: "Present-day porosity as a fraction (0-1).",
      id: "porosityFraction",
      kind: "number",
      label: "Porosity",
    },
    {
      description:
        "Porosity assumed at deposition as a fraction (0-1); default 0 (full decompaction).",
      default: 0,
      id: "targetPorosityFraction",
      kind: "number",
      label: "Target porosity",
    },
  ],
  outputs: [
    {
      description: "Decompacted thickness at the target porosity in metres.",
      id: "decompactedThicknessM",
      kind: "number",
      label: "Decompacted thickness",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateDecompactedThickness(
      input as unknown as DecompactedThicknessInput,
    ),
});

export const runDecompactedThickness = decompactedThicknessTool.execute;
export default decompactedThicknessTool;
