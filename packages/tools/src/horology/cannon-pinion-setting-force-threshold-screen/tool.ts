import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CannonPinionForceInput = {
  readonly maximumAllowedPullForceNewtons: number;
  readonly measuredPullForceNewtons: number;
  readonly minimumAllowedPullForceNewtons: number;
};

export type CannonPinionForceOutput = {
  readonly forceAboveMinimumNewtons: number;
  readonly forceBelowMaximumNewtons: number;
  readonly withinCallerForceWindow: boolean;
};

export const screenCannonPinionSettingForce = (
  input: CannonPinionForceInput,
): CannonPinionForceOutput => {
  if (
    !Number.isFinite(input.measuredPullForceNewtons) ||
    input.measuredPullForceNewtons < 0
  )
    simpleError(
      "measuredPullForceNewtons",
      "Measured pull force must be finite and nonnegative.",
      "measured_force_invalid",
    );
  if (
    !Number.isFinite(input.minimumAllowedPullForceNewtons) ||
    input.minimumAllowedPullForceNewtons < 0
  )
    simpleError(
      "minimumAllowedPullForceNewtons",
      "Minimum force must be finite and nonnegative.",
      "minimum_force_invalid",
    );
  if (
    !Number.isFinite(input.maximumAllowedPullForceNewtons) ||
    input.maximumAllowedPullForceNewtons <= 0
  )
    simpleError(
      "maximumAllowedPullForceNewtons",
      "Maximum force must be finite and positive.",
      "maximum_force_invalid",
    );
  if (
    input.minimumAllowedPullForceNewtons > input.maximumAllowedPullForceNewtons
  )
    simpleError(
      "",
      "Minimum force must not exceed maximum force.",
      "force_window_reversed",
    );
  return {
    forceAboveMinimumNewtons:
      input.measuredPullForceNewtons - input.minimumAllowedPullForceNewtons,
    forceBelowMaximumNewtons:
      input.maximumAllowedPullForceNewtons - input.measuredPullForceNewtons,
    withinCallerForceWindow:
      input.measuredPullForceNewtons >= input.minimumAllowedPullForceNewtons &&
      input.measuredPullForceNewtons <= input.maximumAllowedPullForceNewtons,
  };
};

export const cannonPinionForceExample = {
  input: {
    measuredPullForceNewtons: 8,
    minimumAllowedPullForceNewtons: 5,
    maximumAllowedPullForceNewtons: 10,
  },
  output: {
    forceAboveMinimumNewtons: 3,
    forceBelowMaximumNewtons: 2,
    withinCallerForceWindow: true,
  },
} satisfies ToolExample<CannonPinionForceInput, CannonPinionForceOutput>;

export const cannonPinionForceTool = createSimpleTool({
  calculate: (input) =>
    screenCannonPinionSettingForce({
      maximumAllowedPullForceNewtons:
        input.maximumAllowedPullForceNewtons as number,
      measuredPullForceNewtons: input.measuredPullForceNewtons as number,
      minimumAllowedPullForceNewtons:
        input.minimumAllowedPullForceNewtons as number,
    }),
  description:
    "Screen a measured crown pull force against explicit service-specific minimum and maximum values; it does not derive a universal cannon-pinion torque.",
  id: "horology/cannon-pinion-setting-force-threshold-screen",
  inputs: [
    {
      id: "maximumAllowedPullForceNewtons",
      kind: "number",
      label: "Maximum allowed pull force",
      minimum: 0,
      unit: "N",
    },
    {
      id: "measuredPullForceNewtons",
      kind: "number",
      label: "Measured crown pull force",
      minimum: 0,
      unit: "N",
    },
    {
      id: "minimumAllowedPullForceNewtons",
      kind: "number",
      label: "Minimum allowed pull force",
      minimum: 0,
      unit: "N",
    },
  ],
  outputs: [
    {
      id: "forceAboveMinimumNewtons",
      kind: "number",
      label: "Force above minimum",
      unit: "N",
    },
    {
      id: "forceBelowMaximumNewtons",
      kind: "number",
      label: "Force below maximum",
      unit: "N",
    },
    {
      id: "withinCallerForceWindow",
      kind: "boolean",
      label: "Within caller force window",
    },
  ],
  title: "Cannon Pinion Setting Force Threshold Screen",
});

export const runCannonPinionForce = cannonPinionForceTool.execute;
export default cannonPinionForceTool;
