import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CementCompressiveStrengthInput = {
  readonly failureLoadKilonewtons: number;
  readonly cubeSideMillimetres: number;
};

export type CementCompressiveStrengthOutput = {
  readonly compressiveStrengthMegapascals: number;
};

export const calculateCementCompressiveStrength = (
  input: CementCompressiveStrengthInput,
): CementCompressiveStrengthOutput => {
  if (!(input.failureLoadKilonewtons > 0))
    return simpleError(
      "failureLoadKilonewtons",
      "Failure load must be greater than zero.",
      "invalid_load",
    );
  if (!(input.cubeSideMillimetres > 0))
    return simpleError(
      "cubeSideMillimetres",
      "Cube side length must be greater than zero.",
      "invalid_geometry",
    );
  return {
    compressiveStrengthMegapascals:
      (input.failureLoadKilonewtons * 1000) /
      (input.cubeSideMillimetres * input.cubeSideMillimetres),
  };
};

export const cementCompressiveStrengthExample = {
  input: { failureLoadKilonewtons: 56.25, cubeSideMillimetres: 50 },
  output: { compressiveStrengthMegapascals: 22.5 },
} satisfies ToolExample<
  CementCompressiveStrengthInput,
  CementCompressiveStrengthOutput
>;

export const cementCompressiveStrengthTool = createSimpleTool({
  id: "geology/cement-compressive-strength",
  title: "Cement Compressive Strength Calculator",
  description:
    "Compute unconfined compressive strength of a cement cube from its crush load and specimen dimensions.",
  inputs: [
    {
      description: "Peak load at failure in kilonewtons.",
      id: "failureLoadKilonewtons",
      kind: "number",
      label: "Failure load",
    },
    {
      description: "Cube side length in millimetres.",
      id: "cubeSideMillimetres",
      kind: "number",
      label: "Cube side",
    },
  ],
  outputs: [
    {
      description: "Unconfined compressive strength in megapascals.",
      id: "compressiveStrengthMegapascals",
      kind: "number",
      label: "Strength",
    },
  ],
  calculate: (input) =>
    calculateCementCompressiveStrength(
      input as unknown as CementCompressiveStrengthInput,
    ),
});

export const runCementCompressiveStrength =
  cementCompressiveStrengthTool.execute;
export default cementCompressiveStrengthTool;
