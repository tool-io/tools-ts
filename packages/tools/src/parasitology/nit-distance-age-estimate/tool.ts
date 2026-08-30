import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly nitDistancesMm: readonly number[];
  readonly hairGrowthMmPerDay: number;
  readonly maximumRecentDays: number;
}>;
export type Output = Readonly<{
  readonly estimatedAttachmentDays: readonly number[];
  readonly recentIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  input.nitDistancesMm.forEach((v) => nonnegative(v, "nitDistancesMm"));
  positive(input.hairGrowthMmPerDay, "hairGrowthMmPerDay");
  nonnegative(input.maximumRecentDays, "maximumRecentDays");
  const estimatedAttachmentDays = input.nitDistancesMm.map(
    (v) => v / input.hairGrowthMmPerDay,
  );
  return {
    estimatedAttachmentDays,
    recentIndexes: estimatedAttachmentDays.flatMap((v, i) =>
      v <= input.maximumRecentDays ? [i] : [],
    ),
  };
};
export const exampleInput = {
  nitDistancesMm: [2, 6, 10],
  hairGrowthMmPerDay: 0.4,
  maximumRecentDays: 14,
} satisfies Input;
export const exampleOutput = {
  estimatedAttachmentDays: [5, 15, 25],
  recentIndexes: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/nit-distance-age-estimate",
  title: "Nit Distance Age Estimate",
  description:
    "Estimate elapsed hair-growth time from nit distance; distance alone does not establish nit viability.",
  inputs: [
    { id: "nitDistancesMm", label: "Nit distances mm", kind: "numberList" },
    {
      id: "hairGrowthMmPerDay",
      label: "Hair growth mm per day",
      kind: "number",
    },
    { id: "maximumRecentDays", label: "Maximum recent days", kind: "number" },
  ],
  outputs: [
    {
      id: "estimatedAttachmentDays",
      label: "Estimated attachment days",
      kind: "numberList",
    },
    { id: "recentIndexes", label: "Recent indexes", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      nitDistancesMm: value.nitDistancesMm as readonly number[],
      hairGrowthMmPerDay: value.hairGrowthMmPerDay as number,
      maximumRecentDays: value.maximumRecentDays as number,
    }),
});
export const run = tool.execute;
export default tool;
