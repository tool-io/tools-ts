import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly preFreezeMotile: number;
  readonly preFreezeTotal: number;
  readonly postThawMotile: number;
  readonly postThawTotal: number;
}>;
export type Output = Readonly<{
  readonly preFreezeMotilityPercent: number;
  readonly postThawMotilityPercent: number;
  readonly motilityChangePoints: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.preFreezeMotile, "preFreezeMotile");
  count(input.preFreezeTotal, "preFreezeTotal", 1);
  count(input.postThawMotile, "postThawMotile");
  count(input.postThawTotal, "postThawTotal", 1);
  if (
    input.preFreezeMotile > input.preFreezeTotal ||
    input.postThawMotile > input.postThawTotal
  )
    simpleError(
      "preFreezeMotile",
      "Motile counts must not exceed assessed totals.",
    );
  const preFreezeMotilityPercent =
      (100 * input.preFreezeMotile) / input.preFreezeTotal,
    postThawMotilityPercent =
      (100 * input.postThawMotile) / input.postThawTotal;
  return {
    preFreezeMotilityPercent,
    postThawMotilityPercent,
    motilityChangePoints: postThawMotilityPercent - preFreezeMotilityPercent,
  };
};
export const exampleInput = {
  preFreezeMotile: 80,
  preFreezeTotal: 100,
  postThawMotile: 60,
  postThawTotal: 100,
} satisfies Input;
export const exampleOutput = {
  preFreezeMotilityPercent: 80,
  postThawMotilityPercent: 60,
  motilityChangePoints: -20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/post-thaw-motility-loss",
  title: "Post Thaw Motility Loss",
  description:
    "Compare observed motility before freezing and after thawing; motility is not a definitive viability test.",
  inputs: [
    { id: "preFreezeMotile", label: "Pre freeze motile", kind: "integer" },
    { id: "preFreezeTotal", label: "Pre freeze total", kind: "integer" },
    { id: "postThawMotile", label: "Post thaw motile", kind: "integer" },
    { id: "postThawTotal", label: "Post thaw total", kind: "integer" },
  ],
  outputs: [
    {
      id: "preFreezeMotilityPercent",
      label: "Pre freeze motility percent",
      kind: "number",
    },
    {
      id: "postThawMotilityPercent",
      label: "Post thaw motility percent",
      kind: "number",
    },
    {
      id: "motilityChangePoints",
      label: "Motility change points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      preFreezeMotile: value.preFreezeMotile as number,
      preFreezeTotal: value.preFreezeTotal as number,
      postThawMotile: value.postThawMotile as number,
      postThawTotal: value.postThawTotal as number,
    }),
});
export const run = tool.execute;
export default tool;
