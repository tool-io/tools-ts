import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nearFaultFlingStepVelocityPulseExample = {
  input: { slipM: 2, riseTimeSeconds: 4 },
  output: { flingVelocityMS: 0.5 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const nearFaultFlingStepVelocityPulseTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ slipM, riseTimeSeconds }) => {
      if (riseTimeSeconds <= 0)
        simpleError("riseTimeSeconds", "Rise time must be positive.");
      return { flingVelocityMS: slipM / riseTimeSeconds };
    })(input as never) as Record<string, unknown>,
  description:
    "Fling-step peak velocity from static slip and rise time: v ≈ Δu / τ.",
  id: "seismology/near-fault-fling-step-velocity-pulse",
  inputs: [
    {
      minimum: 0,
      description: "Static slip.",
      id: "slipM",
      kind: "number",
      label: "Δu",
      unit: "m",
    },
    {
      minimum: 0,
      description: "Slip rise time.",
      id: "riseTimeSeconds",
      kind: "number",
      label: "τ",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Fling-step peak velocity.",
      id: "flingVelocityMS",
      kind: "number",
      label: "v_fling",
      unit: "m/s",
    },
  ],
  title: "Near Fault Fling Step Velocity Pulse Calculator",
});
export const runNearFaultFlingStepVelocityPulse =
  nearFaultFlingStepVelocityPulseTool.execute;
export { nearFaultFlingStepVelocityPulseExample as example };
export default nearFaultFlingStepVelocityPulseTool;
