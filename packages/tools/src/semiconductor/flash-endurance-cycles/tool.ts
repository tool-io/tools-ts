import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlashEnduranceCyclesInput = {
  readonly completedCycleCount: number;
  readonly ratedCycleCount: number;
};

export type FlashEnduranceCyclesOutput = {
  readonly enduranceUsedPercent: number;
  readonly remainingCycles: number;
};

export const flashEnduranceCyclesExample = {
  input: {
    completedCycleCount: 2500,
    ratedCycleCount: 10000,
  },
  output: { enduranceUsedPercent: 25, remainingCycles: 7500 },
} satisfies ToolExample<FlashEnduranceCyclesInput, FlashEnduranceCyclesOutput>;

export const calculateFlashEnduranceCycles = (
  input: FlashEnduranceCyclesInput,
): FlashEnduranceCyclesOutput => {
  if (!Number.isSafeInteger(input.ratedCycleCount) || input.ratedCycleCount < 1)
    simpleError(
      "ratedCycleCount",
      "Rated cycles must be a positive safe integer.",
    );
  if (
    !Number.isSafeInteger(input.completedCycleCount) ||
    input.completedCycleCount < 0
  )
    simpleError(
      "completedCycleCount",
      "Completed cycles must be a non-negative safe integer.",
    );
  return {
    enduranceUsedPercent:
      (100 * input.completedCycleCount) / input.ratedCycleCount,
    remainingCycles: Math.max(
      input.ratedCycleCount - input.completedCycleCount,
      0,
    ),
  };
};

export const flashEnduranceCyclesTool = createSimpleTool({
  id: "semiconductor/flash-endurance-cycles",
  title: "Flash Endurance Cycles Calculator",
  description:
    "Calculate rated flash program-erase cycles remaining and the percentage consumed from completed and rated cycle counts.",
  inputs: [
    {
      description: "Rated endurance cycles at the specified verify margin.",
      id: "ratedCycleCount",
      kind: "integer",
      label: "Rated cycles",
      minimum: 1,
    },
    {
      description: "Program-erase cycles already completed.",
      id: "completedCycleCount",
      kind: "integer",
      label: "Completed cycles",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Rated cycles not yet consumed, clamped to zero after the rating is exceeded.",
      format: "cycles",
      id: "remainingCycles",
      kind: "integer",
      label: "Remaining cycles",
    },
    {
      description:
        "Completed cycles divided by rated endurance, expressed as a percentage.",
      id: "enduranceUsedPercent",
      kind: "number",
      label: "Endurance used",
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFlashEnduranceCycles({
      completedCycleCount: input.completedCycleCount as number,
      ratedCycleCount: input.ratedCycleCount as number,
    }),
});
export const runFlashEnduranceCycles = flashEnduranceCyclesTool.execute;
export default flashEnduranceCyclesTool;
