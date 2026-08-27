import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReserveRecoverableInput = {
  readonly originalOilInPlaceSm3: number;
  readonly recoveryFactor?: number;
};

export type ReserveRecoverableOutput = {
  readonly recoverableReservesSm3: number;
};

export const calculateReserveRecoverable = (
  input: ReserveRecoverableInput,
): ReserveRecoverableOutput => {
  const inPlaceSm3 = input.originalOilInPlaceSm3;
  const factor = input.recoveryFactor ?? 0.3;
  if (!(inPlaceSm3 > 0))
    simpleError(
      "originalOilInPlaceSm3",
      "Oil in place must be greater than zero.",
      "invalid_volume",
    );
  if (!(factor >= 0 && factor <= 1))
    simpleError(
      "recoveryFactor",
      "Recovery factor must lie between zero and one.",
      "invalid_recovery_factor",
    );
  return { recoverableReservesSm3: inPlaceSm3 * factor };
};

export const reserveRecoverableExample = {
  input: { originalOilInPlaceSm3: 250_000_000, recoveryFactor: 0.32 },
  output: { recoverableReservesSm3: 80000000 },
} satisfies ToolExample<ReserveRecoverableInput, ReserveRecoverableOutput>;

export const reserveRecoverableTool = createSimpleTool({
  id: "geology/reserve-recoverable",
  title: "Reserve Recoverable Calculator",
  description:
    "Compute recoverable reserves as original oil in place multiplied by the recovery factor.",
  inputs: [
    {
      description: "Original oil in place at stock-tank conditions.",
      id: "originalOilInPlaceSm3",
      kind: "number",
      label: "OOIP",
      minimum: 0,
      unit: "m3",
    },
    {
      default: 0.3,
      description: "Expected recovery factor as a fraction.",
      id: "recoveryFactor",
      kind: "number",
      label: "Recovery factor",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Recoverable reserves at stock-tank conditions.",
      id: "recoverableReservesSm3",
      kind: "number",
      label: "Recoverable reserves",
      unit: "m3",
    },
  ],
  calculate: (input) =>
    calculateReserveRecoverable(input as unknown as ReserveRecoverableInput),
});

export const runReserveRecoverable = reserveRecoverableTool.execute;
export default reserveRecoverableTool;
