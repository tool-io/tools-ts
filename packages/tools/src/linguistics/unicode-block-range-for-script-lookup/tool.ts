import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch40-shared.js";
export type Input = Readonly<{ readonly scriptGroup: string }>;
export type Output = Readonly<{
  readonly selectedBlockRangesDecimal: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "scriptGroup", label: "Script group", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    selectedBlockRangesDecimal: pick(
      input.scriptGroup,
      {
        Latin: [
          [0, 127],
          [128, 255],
          [256, 383],
          [384, 591],
        ],
        Greek: [
          [880, 1023],
          [7936, 8191],
        ],
        Cyrillic: [
          [1024, 1279],
          [1280, 1327],
        ],
        Arabic: [
          [1536, 1791],
          [1872, 1919],
        ],
        Han: [
          [13312, 19903],
          [19968, 40959],
          [131072, 173791],
        ],
      },
      "script group",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { scriptGroup: "Greek" } satisfies Input;
export const exampleOutput = {
  selectedBlockRangesDecimal: [
    [880, 1023],
    [7936, 8191],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/unicode-block-range-for-script-lookup",
  title: "Unicode Block Range For Script Lookup",
  description:
    "Bounded selected common Unicode block ranges for supported script groups; blocks include punctuation/non-script characters and are not Unicode Script property membership or complete script coverage. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "selectedBlockRangesDecimal",
      label: "Selected block ranges decimal",
      kind: "matrix",
    },
  ],
  calculate: (value) => calculate({ scriptGroup: value.scriptGroup as string }),
});
export const run = tool.execute;
export default tool;
