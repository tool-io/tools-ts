import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly treatmentCompletionYear: number;
  readonly followupYearOffsets: readonly number[];
}>;
export type Output = Readonly<{
  readonly scheduledFollowupYears: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  count(input.treatmentCompletionYear, "treatmentCompletionYear");
  if (!input.followupYearOffsets.length)
    simpleError(
      "followupYearOffsets",
      "Nonempty surveillance intervals required.",
    );
  input.followupYearOffsets.forEach((v, i) => {
    count(v, "followupYearOffsets", 1);
    if (i > 0 && v <= input.followupYearOffsets[i - 1])
      simpleError(
        "followupYearOffsets",
        "Distinct increasing year offsets required.",
      );
  });
  return {
    scheduledFollowupYears: input.followupYearOffsets.map(
      (v) => input.treatmentCompletionYear + v,
    ),
  };
};
export const exampleInput = {
  treatmentCompletionYear: 2026,
  followupYearOffsets: [1, 3, 5],
} satisfies Input;
export const exampleOutput = {
  scheduledFollowupYears: [2027, 2029, 2031],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/surveillance-followup-years",
  title: "Surveillance Followup Years",
  description:
    "Schedule surveillance calendar years using caller-defined offsets after treatment completion.",
  inputs: [
    {
      id: "treatmentCompletionYear",
      label: "Treatment completion year",
      kind: "integer",
    },
    {
      id: "followupYearOffsets",
      label: "Followup year offsets",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "scheduledFollowupYears",
      label: "Scheduled followup years",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      treatmentCompletionYear: value.treatmentCompletionYear as number,
      followupYearOffsets: value.followupYearOffsets as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
