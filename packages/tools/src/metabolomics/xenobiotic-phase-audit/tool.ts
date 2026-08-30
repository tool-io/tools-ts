import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly reactionPhases: readonly string[];
  readonly minimumPhaseOneCount: number;
  readonly minimumPhaseTwoCount: number;
}>;
export type Output = Readonly<{
  readonly phaseOneCount: number;
  readonly phaseTwoCount: number;
  readonly orderingValid: boolean;
  readonly complete: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.reactionPhases.length === 0 ||
    input.reactionPhases.some((v) => v !== "I" && v !== "II")
  )
    simpleError("reactionPhases", "Only phase I and II labels are supported.");
  const phaseOneCount = input.reactionPhases.filter((v) => v === "I").length,
    phaseTwoCount = input.reactionPhases.length - phaseOneCount,
    firstTwo = input.reactionPhases.indexOf("II"),
    orderingValid =
      firstTwo >= 0
        ? input.reactionPhases.slice(firstTwo).every((v) => v === "II")
        : true;
  return {
    phaseOneCount,
    phaseTwoCount,
    orderingValid,
    complete:
      orderingValid &&
      phaseOneCount >= input.minimumPhaseOneCount &&
      phaseTwoCount >= input.minimumPhaseTwoCount,
  };
};
export const exampleInput = {
  reactionPhases: ["I", "I", "II"],
  minimumPhaseOneCount: 1,
  minimumPhaseTwoCount: 1,
} satisfies Input;
export const exampleOutput = {
  phaseOneCount: 2,
  phaseTwoCount: 1,
  orderingValid: true,
  complete: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/xenobiotic-phase-audit",
  title: "Xenobiotic Phase Audit",
  description: "Audit observed xenobiotic reaction order and phase coverage.",
  inputs: [
    { id: "reactionPhases", kind: "stringList", label: "Reaction phases" },
    {
      id: "minimumPhaseOneCount",
      kind: "number",
      label: "Minimum phase one count",
    },
    {
      id: "minimumPhaseTwoCount",
      kind: "number",
      label: "Minimum phase two count",
    },
  ],
  outputs: [
    { id: "phaseOneCount", kind: "number", label: "Phase one count" },
    { id: "phaseTwoCount", kind: "number", label: "Phase two count" },
    { id: "orderingValid", kind: "boolean", label: "Ordering valid" },
    { id: "complete", kind: "boolean", label: "Complete" },
  ],
  calculate: (value) =>
    calculate({
      reactionPhases: value.reactionPhases as readonly string[],
      minimumPhaseOneCount: value.minimumPhaseOneCount as number,
      minimumPhaseTwoCount: value.minimumPhaseTwoCount as number,
    }),
});
export const run = tool.execute;
export default tool;
