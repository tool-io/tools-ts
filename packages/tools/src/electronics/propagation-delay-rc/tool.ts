import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PropagationDelayRcInput = {
  readonly rOhms: number;
  readonly cLoadFarads: number;
};

export type PropagationDelayRcOutput = {
  readonly propagationDelayNs: number;
};

export const propagationDelayRcExample = {
  input: { rOhms: 10000, cLoadFarads: 1e-10 },
  output: { propagationDelayNs: 690 },
} satisfies ToolExample<PropagationDelayRcInput, PropagationDelayRcOutput>;

export const calculatePropagationDelayRc = (
  input: PropagationDelayRcInput,
): PropagationDelayRcOutput => {
  if (!(input.rOhms > 0))
    simpleError("rOhms", "Resistance must be positive.", "invalid_r_ohms");
  if (!(input.cLoadFarads > 0))
    simpleError(
      "cLoadFarads",
      "Load capacitance must be positive.",
      "invalid_c_load_farads",
    );
  return {
    propagationDelayNs: 0.69 * input.rOhms * input.cLoadFarads * 1e9,
  };
};

export const propagationDelayRcTool = createSimpleTool({
  calculate: (input) =>
    calculatePropagationDelayRc(input as unknown as PropagationDelayRcInput),
  description:
    "Compute the single RC propagation delay as 0.69 x R x C expressed in nanoseconds, where 0.69 approximates ln(2) for a 50 percent transition.",
  id: "electronics/propagation-delay-rc",
  inputs: [
    { id: "rOhms", kind: "number", label: "Resistance", unit: "Ω" },
    { id: "cLoadFarads", kind: "number", label: "Load capacitance", unit: "F" },
  ],
  outputs: [
    {
      id: "propagationDelayNs",
      kind: "number",
      label: "Propagation delay",
      unit: "ns",
    },
  ],
  title: "RC Propagation Delay",
});
export const runPropagationDelayRc = propagationDelayRcTool.execute;
export default propagationDelayRcTool;
