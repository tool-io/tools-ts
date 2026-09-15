import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly sPhoneme: string;
  readonly zBeforeVowelPhoneme: string;
  readonly cBeforeEOrIPhoneme: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sPhoneme", label: "S phoneme", kind: "string" },
  {
    id: "zBeforeVowelPhoneme",
    label: "Z before vowel phoneme",
    kind: "string",
  },
  {
    id: "cBeforeEOrIPhoneme",
    label: "C before e or i phoneme",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  for (const s of [i.sPhoneme, i.zBeforeVowelPhoneme, i.cBeforeEOrIPhoneme])
    pick(s, { s: 0, θ: 1, unknown: 2 }, "phoneme");
  return {
    observedMerger:
      i.sPhoneme === "unknown" ||
      i.zBeforeVowelPhoneme === "unknown" ||
      i.cBeforeEOrIPhoneme === "unknown"
        ? "unknown"
        : i.sPhoneme === "s" &&
            i.zBeforeVowelPhoneme === "s" &&
            i.cBeforeEOrIPhoneme === "s"
          ? "seseo-pattern"
          : "not-seseo-pattern",
    speakerOriginInferred: false,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { sPhoneme: "s", zBeforeVowelPhoneme: "s", cBeforeEOrIPhoneme: "s" },
  output: {
    result: { observedMerger: "seseo-pattern", speakerOriginInferred: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/latin-american-seseo-checker",
  title: "Latin American Seseo Check",
  description:
    "Classify caller transcribed /s/ merger observations; not geographic, demographic or identity inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
