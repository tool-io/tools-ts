import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly ratedCastCount: number;
  readonly completedCastCount: number;
  readonly observedDefectRatePercent: number;
  readonly maximumDefectRatePercent: number;
}>;
export type Output = Readonly<{
  readonly ratedCastsRemaining: number;
  readonly lifeUsedPercent: number;
  readonly defectRateAcceptable: boolean;
  readonly replacementDue: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.ratedCastCount <= 0 ||
    input.completedCastCount > input.ratedCastCount
  )
    simpleError(
      "ratedCastCount",
      "Rated casts must be positive and not below completed casts.",
      "invalid_counts",
    );
  const ratedCastsRemaining = input.ratedCastCount - input.completedCastCount;
  return {
    ratedCastsRemaining,
    lifeUsedPercent: (input.completedCastCount / input.ratedCastCount) * 100,
    defectRateAcceptable:
      input.observedDefectRatePercent <= input.maximumDefectRatePercent,
    replacementDue:
      ratedCastsRemaining === 0 ||
      input.observedDefectRatePercent > input.maximumDefectRatePercent,
  };
};

export const exampleInput = {
  ratedCastCount: 100,
  completedCastCount: 75,
  observedDefectRatePercent: 2,
  maximumDefectRatePercent: 5,
} satisfies Input;
export const exampleOutput = {
  ratedCastsRemaining: 25,
  lifeUsedPercent: 75,
  defectRateAcceptable: true,
  replacementDue: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      ratedCastCount: input.ratedCastCount as number,
      completedCastCount: input.completedCastCount as number,
      observedDefectRatePercent: input.observedDefectRatePercent as number,
      maximumDefectRatePercent: input.maximumDefectRatePercent as number,
    }),
  description: "Track remaining mold life and defect-rate replacement status.",
  id: "theatre/mold-life-remaining",
  inputs: [
    {
      id: "ratedCastCount",
      label: "Rated mold casts",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "completedCastCount",
      label: "Completed casts",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "observedDefectRatePercent",
      label: "Observed defect rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "maximumDefectRatePercent",
      label: "Maximum defect rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "ratedCastsRemaining",
      label: "Rated casts remaining",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "lifeUsedPercent",
      label: "Rated life used",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "defectRateAcceptable",
      label: "Defect rate acceptable",
      kind: "boolean",
    },
    { id: "replacementDue", label: "Replacement due", kind: "boolean" },
  ],
  title: "Mold Life Remaining",
});

export const run = tool.execute;
export default tool;
