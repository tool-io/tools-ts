import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CoreLossSteinmetzInput = {
  readonly alphaExp?: number;
  readonly betaExp?: number;
  readonly fluxDensityMt: number;
  readonly frequencyKhz: number;
  readonly kSteinmetz?: number;
};

export type CoreLossSteinmetzOutput = {
  readonly coreLossMwPerCm3: number;
};

export const coreLossSteinmetzExample = {
  input: { fluxDensityMt: 200, frequencyKhz: 100 },
  output: { coreLossMwPerCm3: 0.028991186547107816 },
} satisfies ToolExample<CoreLossSteinmetzInput, CoreLossSteinmetzOutput>;

export const calculateCoreLossSteinmetz = (
  input: CoreLossSteinmetzInput,
): CoreLossSteinmetzOutput => {
  const kSteinmetz = input.kSteinmetz ?? 0.001;
  const alphaExp = input.alphaExp ?? 1.5;
  const betaExp = input.betaExp ?? 2.2;
  if (!(kSteinmetz > 0))
    simpleError(
      "kSteinmetz",
      "Steinmetz coefficient must be positive.",
      "invalid_coefficient",
    );
  if (!(alphaExp > 0))
    simpleError(
      "alphaExp",
      "Frequency exponent must be positive.",
      "invalid_exponent",
    );
  if (!(betaExp > 0))
    simpleError(
      "betaExp",
      "Flux exponent must be positive.",
      "invalid_exponent",
    );
  if (!(input.frequencyKhz > 0))
    simpleError(
      "frequencyKhz",
      "Frequency must be positive.",
      "invalid_frequency",
    );
  if (!(input.fluxDensityMt >= 0))
    simpleError(
      "fluxDensityMt",
      "Flux density cannot be negative.",
      "invalid_flux",
    );
  return {
    coreLossMwPerCm3:
      kSteinmetz *
      Math.pow(input.frequencyKhz, alphaExp) *
      Math.pow(input.fluxDensityMt / 1000, betaExp),
  };
};

export const coreLossSteinmetzTool = createSimpleTool({
  calculate: (input) =>
    calculateCoreLossSteinmetz(input as unknown as CoreLossSteinmetzInput),
  description:
    "Compute Steinmetz core loss in mW/cm^3 as k x f^alpha x (B/1000)^beta; defaults k = 0.001, alpha = 1.5, beta = 2.2.",
  id: "electronics/core-loss-steinmetz",
  inputs: [
    {
      default: 1.5,
      id: "alphaExp",
      kind: "number",
      label: "Frequency exponent",
      required: false,
    },
    {
      default: 2.2,
      id: "betaExp",
      kind: "number",
      label: "Flux exponent",
      required: false,
    },
    { id: "fluxDensityMt", kind: "number", label: "Flux density", unit: "mT" },
    { id: "frequencyKhz", kind: "number", label: "Frequency", unit: "kHz" },
    {
      default: 0.001,
      id: "kSteinmetz",
      kind: "number",
      label: "Steinmetz coefficient",
      required: false,
    },
  ],
  outputs: [
    {
      id: "coreLossMwPerCm3",
      kind: "number",
      label: "Core loss",
      unit: "mW/cm³",
    },
  ],
  title: "Steinmetz Core Loss",
});
export const runCoreLossSteinmetz = coreLossSteinmetzTool.execute;
export default coreLossSteinmetzTool;
