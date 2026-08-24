import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const MU_B_UEV_PER_TESLA = 57.8838180666;

export type SpinQubitZeemanSplittingInput = {
  readonly gFactor?: number;
  readonly magneticFieldTesla: number;
};

export type SpinQubitZeemanSplittingOutput = {
  readonly splittingMicroEv: number;
};

export const spinQubitZeemanSplittingExample = {
  input: { gFactor: 2, magneticFieldTesla: 1 },
  output: { splittingMicroEv: 115.7676361332 },
} satisfies ToolExample<
  SpinQubitZeemanSplittingInput,
  SpinQubitZeemanSplittingOutput
>;

export const spinQubitZeemanSplittingTool = createSimpleTool({
  id: "semiconductor/spin-qubit-zeeman-splitting",
  title: "Zeeman Splitting Calculator",
  description:
    "Compute the Zeeman energy splitting of a spin qubit from its g factor and the applied magnetic field.",
  inputs: [
    {
      description: "Applied static magnetic field.",
      id: "magneticFieldTesla",
      kind: "number",
      label: "Magnetic field",
      unit: "T",
    },
    {
      default: 2,
      description: "Electron g factor of the qubit material.",
      id: "gFactor",
      kind: "number",
      label: "g factor",
    },
  ],
  outputs: [
    {
      description: "Energy splitting between spin states.",
      format: "energy-ueV",
      id: "splittingMicroEv",
      kind: "number",
      label: "Zeeman splitting",
      unit: "ueV",
    },
  ],
  calculate: (input) => {
    const gFactor = (input.gFactor ?? 2) as number;
    return {
      splittingMicroEv:
        Math.abs(gFactor * (input.magneticFieldTesla as number)) *
        MU_B_UEV_PER_TESLA,
    };
  },
});
export const runSpinQubitZeemanSplitting = spinQubitZeemanSplittingTool.execute;
export default spinQubitZeemanSplittingTool;
