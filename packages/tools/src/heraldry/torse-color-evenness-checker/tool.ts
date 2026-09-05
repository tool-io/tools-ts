import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly annotatedTorseColorSequence: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "annotatedTorseColorSequence",
    label: "Annotated torse color sequence",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.annotatedTorseColorSequence.length ||
    input.annotatedTorseColorSequence.some((v) => !v.trim())
  )
    simpleError("segments", "Explicit nonempty annotated segments.");
  return {
    colorCount: new Set(input.annotatedTorseColorSequence).size,
    segmentCount: input.annotatedTorseColorSequence.length,
    evenSegmentCount: input.annotatedTorseColorSequence.length % 2 === 0,
    alternatesTwoColors:
      new Set(input.annotatedTorseColorSequence).size === 2 &&
      input.annotatedTorseColorSequence.every(
        (v, i) => i < 2 || v === input.annotatedTorseColorSequence[i % 2],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { annotatedTorseColorSequence: ["or", "gules", "or", "gules"] },
  output: {
    result: {
      colorCount: 2,
      segmentCount: 4,
      evenSegmentCount: true,
      alternatesTwoColors: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/torse-color-evenness-checker",
  title: "Torse Color Count Evenness Checker",
  description:
    "Audit actual torse segment parity/two-colour alternation, not a universal required segment count.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
