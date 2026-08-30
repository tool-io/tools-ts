import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly obituaryText: string;
  readonly honorifics: readonly string[];
  readonly maximumHonorifics: number;
}>;
export type Output = Readonly<{
  readonly honorificCount: number;
  readonly foundHonorifics: readonly string[];
  readonly withinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  const text = input.obituaryText.toLowerCase();
  const foundHonorifics = input.honorifics.filter((value) =>
    text.includes(value.toLowerCase()),
  );
  const honorificCount = input.honorifics.reduce((sum, value) => {
    const needle = value.toLowerCase();
    if (!needle) return sum;
    let count = 0,
      index = 0;
    while ((index = text.indexOf(needle, index)) >= 0) {
      count += 1;
      index += needle.length;
    }
    return sum + count;
  }, 0);
  return {
    honorificCount,
    foundHonorifics,
    withinLimit: honorificCount <= input.maximumHonorifics,
  };
};

export const exampleInput = {
  obituaryText: "Dr. Lee taught for years. Lee retired in 2020.",
  honorifics: ["Dr.", "Mr."],
  maximumHonorifics: 1,
} satisfies Input;
export const exampleOutput = {
  honorificCount: 1,
  foundHonorifics: ["Dr."],
  withinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      obituaryText: input.obituaryText as string,
      honorifics: input.honorifics as readonly string[],
      maximumHonorifics: input.maximumHonorifics as number,
    }),
  description: "Count obituary honorific usage against a supplied limit.",
  id: "journalism/obituary-honorific-style",
  inputs: [
    { id: "obituaryText", label: "Obituary text", kind: "string" },
    { id: "honorifics", label: "Honorifics to count", kind: "stringList" },
    {
      id: "maximumHonorifics",
      label: "Maximum honorific occurrences",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "honorificCount",
      label: "Honorific occurrences",
      kind: "integer",
      minimum: 0,
    },
    { id: "foundHonorifics", label: "Honorifics found", kind: "stringList" },
    { id: "withinLimit", label: "Within supplied limit", kind: "boolean" },
  ],
  title: "Obituary Honorific Style",
});

export const run = tool.execute;
export default tool;
