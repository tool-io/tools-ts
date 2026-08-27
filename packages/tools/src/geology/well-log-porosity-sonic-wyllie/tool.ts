import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogPorositySonicWyllieInput = {
  readonly sonicSlownessUsPerM: number;
  readonly matrixSlownessUsPerM: number;
  readonly fluidSlownessUsPerM: number;
  readonly shaleVolume?: number;
  readonly shaleSlownessUsPerM?: number;
};

export type WellLogPorositySonicWyllieOutput = {
  readonly correctedPorosity: number;
};

export const calculateWellLogPorositySonicWyllie = (
  input: WellLogPorositySonicWyllieInput,
): WellLogPorositySonicWyllieOutput => {
  const deltaLog = input.sonicSlownessUsPerM;
  const deltaMatrix = input.matrixSlownessUsPerM;
  const deltaFluid = input.fluidSlownessUsPerM;
  const shaleVolume = input.shaleVolume ?? 0;
  const deltaShale = input.shaleSlownessUsPerM ?? 0;
  if (!(deltaLog >= 0) || !(deltaMatrix > 0) || !(deltaFluid > 0))
    simpleError(
      "sonicSlownessUsPerM",
      "Sonic slownesses must be positive.",
      "invalid_slowness",
    );
  if (deltaFluid === deltaMatrix)
    simpleError(
      "fluidSlownessUsPerM",
      "Fluid and matrix slownesses must differ.",
      "invalid_slowness",
    );
  if (!(shaleVolume >= 0 && shaleVolume <= 1))
    simpleError(
      "shaleVolume",
      "Shale volume must lie between zero and one.",
      "invalid_shale_volume",
    );
  const matrixTerm = (deltaLog - deltaMatrix) / (deltaFluid - deltaMatrix);
  const shaleTerm =
    shaleVolume === 0
      ? 0
      : (shaleVolume * (deltaShale - deltaMatrix)) / (deltaFluid - deltaMatrix);
  return { correctedPorosity: matrixTerm - shaleTerm };
};

export const wellLogPorositySonicWyllieExample = {
  input: {
    sonicSlownessUsPerM: 300,
    matrixSlownessUsPerM: 182,
    fluidSlownessUsPerM: 620,
    shaleVolume: 0.1,
    shaleSlownessUsPerM: 325,
  },
  output: { correctedPorosity: 0.2367579908675799 },
} satisfies ToolExample<
  WellLogPorositySonicWyllieInput,
  WellLogPorositySonicWyllieOutput
>;

export const wellLogPorositySonicWyllieTool = createSimpleTool({
  id: "geology/well-log-porosity-sonic-wyllie",
  title: "Well Log Porosity Sonic Wyllie Calculator",
  description:
    "Apply the Wyllie time-average equation to a compressional sonic log, with optional shale correction, using slownesses in microseconds per metre.",
  inputs: [
    {
      description:
        "Compressional sonic slowness from the log in microseconds per metre.",
      id: "sonicSlownessUsPerM",
      kind: "number",
      label: "Delta t log",
      minimum: 0,
    },
    {
      description: "Matrix slowness in microseconds per metre.",
      id: "matrixSlownessUsPerM",
      kind: "number",
      label: "Delta t matrix",
    },
    {
      description: "Pore-fluid slowness in microseconds per metre.",
      id: "fluidSlownessUsPerM",
      kind: "number",
      label: "Delta t fluid",
    },
    {
      default: 0,
      description: "Shale volume fraction from 0 to 1.",
      id: "shaleVolume",
      kind: "number",
      label: "V shale",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 0,
      description: "Shale slowness in microseconds per metre.",
      id: "shaleSlownessUsPerM",
      kind: "number",
      label: "Delta t shale",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Wyllie time-average porosity as a volume fraction.",
      id: "correctedPorosity",
      kind: "number",
      label: "Porosity",
    },
  ],
  calculate: (input) =>
    calculateWellLogPorositySonicWyllie(
      input as unknown as WellLogPorositySonicWyllieInput,
    ),
});

export const runWellLogPorositySonicWyllie =
  wellLogPorositySonicWyllieTool.execute;
export default wellLogPorositySonicWyllieTool;
