import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NmrCouplingConstantInput = {
  readonly peakOneHz: number;
  readonly peakTwoHz: number;
  readonly peakSeparationHz?: number;
};

export type NmrCouplingConstantOutput = {
  readonly couplingConstantHz: number;
};

export const nmrCouplingConstantExample = {
  input: { peakOneHz: 500, peakTwoHz: 494 },
  output: { couplingConstantHz: 6 },
} satisfies ToolExample<NmrCouplingConstantInput, NmrCouplingConstantOutput>;

export const nmrCouplingConstantTool = createSimpleTool({
  id: "chemistry/nmr-coupling-constant",
  title: "Coupling Constant Hz",
  description:
    "Compute the scalar coupling constant in Hz either from a validated peak separation or from two distinct peak frequencies.",
  inputs: [
    {
      id: "peakOneHz",
      label: "Peak one frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "peakTwoHz",
      label: "Peak two frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "peakSeparationHz",
      label: "Peak separation",
      kind: "number",
      required: false,
      unit: "Hz",
    },
  ],
  outputs: [
    {
      id: "couplingConstantHz",
      label: "Coupling constant",
      kind: "number",
      unit: "Hz",
    },
  ],
  calculate: (input) => {
    const separation = input.peakSeparationHz as number | undefined;
    if (separation !== undefined) {
      if (!(separation > 0))
        simpleError("peakSeparationHz", "Peak separation must be positive.");
      return { couplingConstantHz: separation };
    }
    const peakOneHz = input.peakOneHz as number;
    const peakTwoHz = input.peakTwoHz as number;
    if (peakOneHz === peakTwoHz)
      simpleError("peakTwoHz", "Peaks must not be equal.", "degenerate_input");
    return { couplingConstantHz: Math.abs(peakOneHz - peakTwoHz) };
  },
});
export const runNmrCouplingConstant = nmrCouplingConstantTool.execute;
export default nmrCouplingConstantTool;
