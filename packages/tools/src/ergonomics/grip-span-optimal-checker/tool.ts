import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, range } from "../shared.js";
export type Input = Readonly<{
  readonly measuredComfortableGripSpanBoundsMm: readonly number[];
  readonly toolAvailableSpanBoundsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleGripSpanBoundsMm: readonly number[];
  readonly compatibleGripSpanFound: boolean;
}>;
const inputFields = [
  {
    id: "measuredComfortableGripSpanBoundsMm",
    label: "Measured comfortable grip span bounds mm",
    kind: "numberList",
  },
  {
    id: "toolAvailableSpanBoundsMm",
    label: "Tool available span bounds mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  range(input.measuredComfortableGripSpanBoundsMm, "measuredSpan");
  range(input.toolAvailableSpanBoundsMm, "toolSpan");
  [
    ...input.measuredComfortableGripSpanBoundsMm,
    ...input.toolAvailableSpanBoundsMm,
  ].forEach((v) => positive(v, "span"));
  const lo = Math.max(
      input.measuredComfortableGripSpanBoundsMm[0],
      input.toolAvailableSpanBoundsMm[0],
    ),
    hi = Math.min(
      input.measuredComfortableGripSpanBoundsMm[1],
      input.toolAvailableSpanBoundsMm[1],
    );
  return {
    compatibleGripSpanBoundsMm: lo <= hi ? [lo, hi] : [],
    compatibleGripSpanFound: lo <= hi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredComfortableGripSpanBoundsMm: [40, 70],
  toolAvailableSpanBoundsMm: [60, 90],
} satisfies Input;
export const exampleOutput = {
  compatibleGripSpanBoundsMm: [60, 70],
  compatibleGripSpanFound: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/grip-span-optimal-checker",
  title: "Grip Span Optimal Range Two-Handle Tool Checker",
  description:
    "Intersect individually measured comfortable two-handle spans with actual adjustable tool range; explicit empty compatibility, no universal 5th–95th optimum or suitability approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleGripSpanBoundsMm",
      label: "Compatible grip span bounds mm",
      kind: "numberList",
    },
    {
      id: "compatibleGripSpanFound",
      label: "Compatible grip span found",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredComfortableGripSpanBoundsMm:
        value.measuredComfortableGripSpanBoundsMm as readonly number[],
      toolAvailableSpanBoundsMm:
        value.toolAvailableSpanBoundsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
