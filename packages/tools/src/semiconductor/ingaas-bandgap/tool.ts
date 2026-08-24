import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type IngaasBandgapInput = {
  readonly galliumFractionX: number;
};

export type IngaasBandgapOutput = {
  readonly bandgapEv: number;
};

export const ingaasBandgapExample = {
  input: { galliumFractionX: 0.53 },
  output: { bandgapEv: 0.8022793 },
} satisfies ToolExample<IngaasBandgapInput, IngaasBandgapOutput>;

const INAS_BANDGAP_EV = 0.354;
const GAAS_BANDGAP_EV = 1.424;
const BOWING_EV = 0.477;

export const calculateIngaasBandgap = (
  input: IngaasBandgapInput,
): IngaasBandgapOutput => {
  const x = input.galliumFractionX;
  return {
    bandgapEv:
      x * GAAS_BANDGAP_EV + (1 - x) * INAS_BANDGAP_EV - BOWING_EV * x * (1 - x),
  };
};

export const ingaasBandgapTool = createSimpleTool({
  calculate: (input) =>
    calculateIngaasBandgap({
      galliumFractionX: input.galliumFractionX as number,
    }),
  description:
    "Compute the 300 K InGaAs band gap from InAs and GaAs endpoints with a 0.477 eV alloy-bowing term.",
  id: "semiconductor/ingaas-bandgap",
  inputs: [
    {
      id: "galliumFractionX",
      kind: "number",
      label: "Gallium fraction x",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bandgapEv",
      kind: "number",
      label: "Band gap energy",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
  ],
  title: "InGaAs Bandgap Calculator",
});
export const runIngaasBandgap = ingaasBandgapTool.execute;
export default ingaasBandgapTool;
