import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MosfetWorkFunctionDifferenceInput = {
  readonly gateWorkFunctionEv: number;
  readonly substrateWorkFunctionEv: number;
};

export type MosfetWorkFunctionDifferenceOutput = {
  readonly phiMsVolts: number;
};

export const mosfetWorkFunctionDifferenceExample = {
  input: { gateWorkFunctionEv: 4.6, substrateWorkFunctionEv: 4.1 },
  output: { phiMsVolts: 0.5 },
} satisfies ToolExample<
  MosfetWorkFunctionDifferenceInput,
  MosfetWorkFunctionDifferenceOutput
>;

export const calculateMosfetWorkFunctionDifference = (
  input: MosfetWorkFunctionDifferenceInput,
): MosfetWorkFunctionDifferenceOutput => {
  if (
    !Number.isFinite(input.gateWorkFunctionEv) ||
    input.gateWorkFunctionEv <= 0
  )
    simpleError("gateWorkFunctionEv", "Gate work function must be positive.");
  if (
    !Number.isFinite(input.substrateWorkFunctionEv) ||
    input.substrateWorkFunctionEv <= 0
  )
    simpleError(
      "substrateWorkFunctionEv",
      "Substrate work function must be positive.",
    );
  return {
    phiMsVolts: input.gateWorkFunctionEv - input.substrateWorkFunctionEv,
  };
};

export const mosfetWorkFunctionDifferenceTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetWorkFunctionDifference({
      gateWorkFunctionEv: input.gateWorkFunctionEv as number,
      substrateWorkFunctionEv: input.substrateWorkFunctionEv as number,
    }),
  description:
    "Compute the metal-semiconductor work function difference from gate and substrate work functions.",
  id: "semiconductor/mosfet-work-function-difference",
  inputs: [
    {
      description: "Gate material work function.",
      id: "gateWorkFunctionEv",
      kind: "number",
      label: "Gate work function",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
    {
      description: "Substrate semiconductor work function.",
      id: "substrateWorkFunctionEv",
      kind: "number",
      label: "Substrate work function",
      minimum: Number.MIN_VALUE,
      unit: "eV",
    },
  ],
  outputs: [
    {
      description: "Work function difference.",
      id: "phiMsVolts",
      kind: "number",
      label: "Phi MS",
      unit: "V",
    },
  ],
  title: "Work Function Difference Calculator",
});
export const runMosfetWorkFunctionDifference =
  mosfetWorkFunctionDifferenceTool.execute;
export default mosfetWorkFunctionDifferenceTool;
