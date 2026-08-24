import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WallPlugCompareInput = {
  readonly lambdaLaserNm?: number;
  readonly lambdaPumpFlashlampNm?: number;
  readonly lambdaPumpDiodeNm?: number;
};

export type WallPlugCompareOutput = {
  readonly flashlampWallPlugPercent: number;
  readonly diodeWallPlugPercent: number;
  readonly diodeImprovementFactor: number;
};

type StageChain = readonly [number, number, number, number, number, number];

const FLASH_STAGES: StageChain = [0.85, 0.55, 0.18, 0.85, 1, 0.7];
const DIODE_STAGES: StageChain = [0.9, 0.5, 0.92, 0.95, 1, 0.75];

const chainPercent = (
  stages: StageChain,
  lambdaPumpNm: number,
  lambdaLaserNm: number,
): number => {
  if (lambdaLaserNm <= 0 || lambdaPumpNm <= 0)
    simpleError("lambdaLaserNm", "Wavelengths must be positive.");
  const stokes = lambdaPumpNm / lambdaLaserNm;
  const total = stages.reduce((product, eta) => product * eta, 1) * stokes;
  return total * 100;
};

export const compareWallPlugEfficiency = (
  input: WallPlugCompareInput,
): WallPlugCompareOutput => {
  const lambdaLaserNm = input.lambdaLaserNm ?? 1064;
  const flashlampWallPlugPercent = chainPercent(
    FLASH_STAGES,
    input.lambdaPumpFlashlampNm ?? 750,
    lambdaLaserNm,
  );
  const diodeWallPlugPercent = chainPercent(
    DIODE_STAGES,
    input.lambdaPumpDiodeNm ?? 808,
    lambdaLaserNm,
  );
  return {
    diodeImprovementFactor: diodeWallPlugPercent / flashlampWallPlugPercent,
    diodeWallPlugPercent,
    flashlampWallPlugPercent,
  };
};

export const wallPlugCompareTool = createSimpleTool({
  calculate: (input) =>
    compareWallPlugEfficiency({
      lambdaLaserNm: input.lambdaLaserNm as number,
      lambdaPumpDiodeNm: input.lambdaPumpDiodeNm as number,
      lambdaPumpFlashlampNm: input.lambdaPumpFlashlampNm as number,
    }),
  description:
    "Chain the stage efficiencies of lamp-pumped and diode-pumped Nd lasers to compare their overall wall-plug efficiency.",
  id: "laser/laser-flashlamp-versus-diode-pumping-wall-plug-efficiency-compare",
  inputs: [
    {
      description: "Lasing wavelength of the crystal.",
      default: 1064,
      id: "lambdaLaserNm",
      kind: "number",
      label: "λ_laser",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Effective pump wavelength of the flashlamp spectrum.",
      default: 750,
      id: "lambdaPumpFlashlampNm",
      kind: "number",
      label: "Flashlamp λ_pump",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Diode pump wavelength.",
      default: 808,
      id: "lambdaPumpDiodeNm",
      kind: "number",
      label: "Diode λ_pump",
      minimum: 0,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Wall-plug efficiency of the lamp-pumped cavity.",
      id: "flashlampWallPlugPercent",
      kind: "number",
      label: "Flashlamp η",
      unit: "%",
    },
    {
      description: "Wall-plug efficiency of the diode-pumped cavity.",
      id: "diodeWallPlugPercent",
      kind: "number",
      label: "Diode η",
      unit: "%",
    },
    {
      description:
        "How many times better the diode-pumped system converts power.",
      id: "diodeImprovementFactor",
      kind: "number",
      label: "Improvement factor",
    },
  ],
  title: "Flashlamp vs Diode Wall-Plug Efficiency",
});
export const runWallPlugCompare = wallPlugCompareTool.execute;
export const wallPlugCompareExample = {
  input: {},
  output: compareWallPlugEfficiency({}),
} satisfies ToolExample<WallPlugCompareInput, WallPlugCompareOutput>;

export default wallPlugCompareTool;

export { wallPlugCompareExample as example };
