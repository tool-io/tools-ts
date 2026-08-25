import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReeferSetpointTempModeLookupInput = {
  readonly setpointTempC: number;
  readonly deepFrozenMaximumC?: number;
  readonly frozenMaximumC?: number;
};

export type ReeferSetpointTempModeLookupOutput = {
  readonly transportMode: "deepFrozen" | "frozen" | "chilled";
};

export const calculateReeferSetpointTempModeLookup = (
  input: ReeferSetpointTempModeLookupInput,
): ReeferSetpointTempModeLookupOutput => {
  if (!Number.isFinite(input.setpointTempC))
    return simpleError(
      "setpointTempC",
      "The setpoint must be a finite temperature.",
      "invalid_temperature",
    );
  const deepFrozenMaximumC = input.deepFrozenMaximumC ?? -18;
  const frozenMaximumC = input.frozenMaximumC ?? 0;
  if (!Number.isFinite(deepFrozenMaximumC))
    return simpleError(
      "deepFrozenMaximumC",
      "The deep-frozen ceiling must be finite.",
      "invalid_thresholds",
    );
  if (!Number.isFinite(frozenMaximumC))
    return simpleError(
      "frozenMaximumC",
      "The frozen ceiling must be finite.",
      "invalid_thresholds",
    );
  if (!(deepFrozenMaximumC < frozenMaximumC))
    return simpleError(
      "deepFrozenMaximumC",
      "The deep-frozen ceiling must be below the frozen ceiling.",
      "invalid_thresholds",
    );
  return {
    transportMode:
      input.setpointTempC <= deepFrozenMaximumC
        ? "deepFrozen"
        : input.setpointTempC < frozenMaximumC
          ? "frozen"
          : "chilled",
  };
};

export const reeferSetpointTempModeLookupExample = {
  input: { setpointTempC: -20 },
  output: { transportMode: "deepFrozen" },
} satisfies ToolExample<
  ReeferSetpointTempModeLookupInput,
  ReeferSetpointTempModeLookupOutput
>;

export const reeferSetpointTempModeLookupTool = createSimpleTool({
  id: "logistics/reefer-setpoint-temp-mode-lookup",
  title: "Reefer Setpoint Temp Mode Lookup",
  description:
    "Classify a reefer setpoint as deepFrozen (at or below the ceiling, default -18 C), frozen (below zero) or chilled (zero or warmer); both ceilings are inputs.",
  inputs: [
    {
      description: "Requested container setpoint in degrees Celsius.",
      id: "setpointTempC",
      kind: "number",
      label: "Setpoint",
    },
    {
      default: -18,
      description:
        "Ceiling at or below which cargo counts as deep-frozen, in degrees Celsius.",
      id: "deepFrozenMaximumC",
      kind: "number",
      label: "Deep-freeze max",
    },
    {
      default: 0,
      description:
        "Ceiling below which cargo counts as frozen, in degrees Celsius.",
      id: "frozenMaximumC",
      kind: "number",
      label: "Freeze max",
    },
  ],
  outputs: [
    {
      description: "Temperature-controlled transport mode for the setpoint.",
      id: "transportMode",
      enum: ["deepFrozen", "frozen", "chilled"],
      kind: "string",
      label: "Mode",
    },
  ],
  calculate: (input) =>
    calculateReeferSetpointTempModeLookup({
      deepFrozenMaximumC: input.deepFrozenMaximumC as number | undefined,
      frozenMaximumC: input.frozenMaximumC as number | undefined,
      setpointTempC: input.setpointTempC as number,
    }),
});

export const runReeferSetpointTempModeLookup =
  reeferSetpointTempModeLookupTool.execute;
export default reeferSetpointTempModeLookupTool;
