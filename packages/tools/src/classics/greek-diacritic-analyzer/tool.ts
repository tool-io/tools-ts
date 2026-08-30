import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly text: string;
}>;
export type Output = Readonly<{
  readonly acuteCount: number;
  readonly graveCount: number;
  readonly circumflexCount: number;
  readonly roughBreathingCount: number;
  readonly smoothBreathingCount: number;
}>;

export const calculate = (input: Input): Output => {
  const normalized = input.text.normalize("NFD");
  if (normalized.length === 0)
    simpleError("text", "Text must not be empty.", "empty_text");
  const count = (mark: string) =>
    [...normalized].filter((character) => character === mark).length;
  return {
    acuteCount: count("\u0301"),
    graveCount: count("\u0300"),
    circumflexCount: count("\u0342") + count("\u0302"),
    roughBreathingCount: count("\u0314"),
    smoothBreathingCount: count("\u0313"),
  };
};

export const exampleInput = { text: "ἄνθρωπος" } satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = { text: "ἡ ἀγορά" } satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      text: input.text as string,
    }),
  description:
    "Count Greek accent and breathing marks after canonical Unicode decomposition.",
  id: "classics/greek-diacritic-analyzer",
  inputs: [{ id: "text", label: "Greek text", kind: "string" }],
  outputs: [
    { id: "acuteCount", label: "Acute accents", kind: "integer", minimum: 0 },
    { id: "graveCount", label: "Grave accents", kind: "integer", minimum: 0 },
    {
      id: "circumflexCount",
      label: "Circumflex accents",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "roughBreathingCount",
      label: "Rough breathings",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "smoothBreathingCount",
      label: "Smooth breathings",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Greek Diacritic Analyzer",
});

export const run = tool.execute;
export default tool;
