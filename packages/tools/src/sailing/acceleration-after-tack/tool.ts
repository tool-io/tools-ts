import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AccelerationAfterTackInput = {
  readonly speedDeficitKt: number;
  readonly accelerationRateKtPerSecond?: number;
};

export type AccelerationAfterTackOutput = {
  readonly recoverySeconds: number;
};

const DEFAULT_ACCELERATION_RATE_KT_PER_SECOND = 0.3;

export const accelerationAfterTackExample = {
  input: { speedDeficitKt: 1.5 },
  output: { recoverySeconds: 5 },
} satisfies ToolExample<
  AccelerationAfterTackInput,
  AccelerationAfterTackOutput
>;

export const calculateAccelerationAfterTack = (
  input: AccelerationAfterTackInput,
): AccelerationAfterTackOutput => {
  const rate =
    input.accelerationRateKtPerSecond ??
    DEFAULT_ACCELERATION_RATE_KT_PER_SECOND;
  if (!(rate > 0))
    simpleError(
      "accelerationRateKtPerSecond",
      "Acceleration rate must be greater than zero.",
      "invalid_rate",
    );
  return { recoverySeconds: input.speedDeficitKt / rate };
};

export const accelerationAfterTackTool = createSimpleTool({
  id: "sailing/acceleration-after-tack",
  title: "Post-Tack Acceleration Time",
  description:
    "Estimate how long a boat needs to recover full speed after a tack from the speed deficit and the acceleration rate.",
  inputs: [
    {
      description: "Speed deficit after the tack.",
      id: "speedDeficitKt",
      kind: "number",
      label: "Speed deficit",
      minimum: 0,
      unit: "kt",
    },
    {
      default: DEFAULT_ACCELERATION_RATE_KT_PER_SECOND,
      description: "Regained speed in knots per second.",
      id: "accelerationRateKtPerSecond",
      kind: "number",
      label: "Acceleration rate",
      minimum: 0,
      unit: "kt/s",
    },
  ],
  outputs: [
    {
      description: "Seconds required to recover full speed.",
      format: "duration-s",
      id: "recoverySeconds",
      kind: "number",
      label: "Recovery time",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateAccelerationAfterTack(
      input as unknown as AccelerationAfterTackInput,
    ),
});

export const runAccelerationAfterTack = accelerationAfterTackTool.execute;
export default accelerationAfterTackTool;
