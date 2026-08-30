import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlashEnduranceRemainingInput = Readonly<{
  readonly ratedCycles: number;
  readonly usedCycles: number;
}>;
export type FlashEnduranceRemainingOutput = Readonly<{
  readonly remainingCycles: number;
}>;

export const calculateFlashEnduranceRemaining = (
  x: FlashEnduranceRemainingInput,
): FlashEnduranceRemainingOutput => {
  if (
    !Number.isFinite(x.ratedCycles) ||
    !Number.isSafeInteger(x.ratedCycles) ||
    x.ratedCycles < 0
  )
    simpleError("ratedCycles", "Provide a safe integer at least 0.");
  if (
    !Number.isFinite(x.usedCycles) ||
    !Number.isSafeInteger(x.usedCycles) ||
    x.usedCycles < 0
  )
    simpleError("usedCycles", "Provide a safe integer at least 0.");
  if (
    !Number.isSafeInteger(x.ratedCycles) ||
    !Number.isSafeInteger(x.usedCycles) ||
    x.usedCycles > x.ratedCycles
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const remainingCycles = x.ratedCycles - x.usedCycles;
  if (
    !Number.isFinite(remainingCycles) ||
    !Number.isSafeInteger(remainingCycles)
  )
    simpleError(
      "remainingCycles",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    remainingCycles: Object.is(remainingCycles, -0) ? 0 : remainingCycles,
  };
};

export const example = {
  input: { ratedCycles: 100000, usedCycles: 1000 },
  output: { remainingCycles: 99000 },
} satisfies ToolExample<
  FlashEnduranceRemainingInput,
  FlashEnduranceRemainingOutput
>;

export const tool = createSimpleTool({
  id: "microcontroller/flash-endurance-remaining",
  title: "Flash Endurance Remaining",
  description:
    "Remaining nominal flash erase/program cycles from a rated cycle count and tracked cycles already used.",
  inputs: [
    { id: "ratedCycles", kind: "integer", label: "Rated Cycles", minimum: 0 },
    { id: "usedCycles", kind: "integer", label: "Used Cycles", minimum: 0 },
  ],
  outputs: [
    { id: "remainingCycles", kind: "integer", label: "Remaining Cycles" },
  ],
  calculate: (input) =>
    calculateFlashEnduranceRemaining({
      ratedCycles: input.ratedCycles as number,
      usedCycles: input.usedCycles as number,
    }),
});
export const flashEnduranceRemainingTool = tool;
export const runFlashEnduranceRemaining = tool.execute;
export default tool;
