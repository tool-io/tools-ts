import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchottkyBarrierHeightInput = {
  readonly metalWorkFunctionEv: number;
  readonly semiconductorElectronAffinityEv: number;
};

export type SchottkyBarrierHeightOutput = {
  readonly barrierHeightEv: number;
};

export const schottkyBarrierHeightExample = {
  input: { metalWorkFunctionEv: 5.65, semiconductorElectronAffinityEv: 4.07 },
  output: { barrierHeightEv: 1.58 },
} satisfies ToolExample<
  SchottkyBarrierHeightInput,
  SchottkyBarrierHeightOutput
>;

export const calculateSchottkyBarrierHeight = (
  input: SchottkyBarrierHeightInput,
): SchottkyBarrierHeightOutput => {
  const barrierHeightEv =
    input.metalWorkFunctionEv - input.semiconductorElectronAffinityEv;
  if (!Number.isFinite(barrierHeightEv))
    simpleError(
      "metalWorkFunctionEv",
      "Barrier height is outside the numeric range.",
    );
  return { barrierHeightEv };
};

export const schottkyBarrierHeightTool = createSimpleTool({
  calculate: (input) =>
    calculateSchottkyBarrierHeight({
      metalWorkFunctionEv: input.metalWorkFunctionEv as number,
      semiconductorElectronAffinityEv:
        input.semiconductorElectronAffinityEv as number,
    }),
  description:
    "Subtract the semiconductor electron affinity from the metal work function to get the ideal Schottky barrier height.",
  id: "semiconductor/schottky-barrier-height",
  inputs: [
    {
      description: "Metal work function.",
      format: "energy-ev",
      id: "metalWorkFunctionEv",
      kind: "number",
      label: "Metal work function",
      minimum: 0,
      unit: "eV",
    },
    {
      description: "Semiconductor electron affinity.",
      format: "energy-ev",
      id: "semiconductorElectronAffinityEv",
      kind: "number",
      label: "Electron affinity",
      unit: "eV",
    },
  ],
  outputs: [
    {
      description:
        "Ideal n-type Schottky-Mott barrier height; a negative result indicates that this idealized model predicts no rectifying barrier.",
      format: "energy-ev",
      id: "barrierHeightEv",
      kind: "number",
      label: "Barrier height",
      unit: "eV",
    },
  ],
  title: "Schottky Barrier Height Calculator",
});
export const runSchottkyBarrierHeight = schottkyBarrierHeightTool.execute;
export default schottkyBarrierHeightTool;
