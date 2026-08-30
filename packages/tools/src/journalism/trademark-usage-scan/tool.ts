import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly copy: string;
  readonly trademark: string;
  readonly requiredMarker: string;
}>;
export type Output = Readonly<{
  readonly trademarkMentions: number;
  readonly firstReferenceMarked: boolean;
  readonly unmarkedMentions: number;
}>;

export const calculate = (input: Input): Output => {
  const mark = input.requiredMarker,
    needle = input.trademark;
  if (!needle)
    simpleError("trademark", "Trademark must not be blank.", "blank_trademark");
  let index = 0,
    trademarkMentions = 0,
    unmarkedMentions = 0,
    firstReferenceMarked = false;
  while (
    (index = input.copy.toLowerCase().indexOf(needle.toLowerCase(), index)) >= 0
  ) {
    const marked =
      input.copy.slice(
        index + needle.length,
        index + needle.length + mark.length,
      ) === mark;
    if (trademarkMentions === 0) firstReferenceMarked = marked;
    if (!marked) unmarkedMentions += 1;
    trademarkMentions += 1;
    index += needle.length;
  }
  return { trademarkMentions, firstReferenceMarked, unmarkedMentions };
};

export const exampleInput = {
  copy: "Acme® launched an Acme product.",
  trademark: "Acme",
  requiredMarker: "®",
} satisfies Input;
export const exampleOutput = {
  trademarkMentions: 2,
  firstReferenceMarked: true,
  unmarkedMentions: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      copy: input.copy as string,
      trademark: input.trademark as string,
      requiredMarker: input.requiredMarker as string,
    }),
  description: "Scan trademark mentions for a required first-reference marker.",
  id: "journalism/trademark-usage-scan",
  inputs: [
    { id: "copy", label: "Copy to inspect", kind: "string" },
    { id: "trademark", label: "Trademark", kind: "string" },
    {
      id: "requiredMarker",
      label: "Required first-reference marker",
      kind: "string",
    },
  ],
  outputs: [
    {
      id: "trademarkMentions",
      label: "Trademark mentions",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "firstReferenceMarked",
      label: "First reference carries marker",
      kind: "boolean",
    },
    {
      id: "unmarkedMentions",
      label: "Unmarked mentions",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Trademark Usage Scan",
});

export const run = tool.execute;
export default tool;
