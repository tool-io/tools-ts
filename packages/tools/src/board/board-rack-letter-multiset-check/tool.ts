import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ rack: string; word: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rack", kind: "string", label: "rack" },
  { id: "word", kind: "string", label: "word" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^[A-Z]*(?![\s\S])/.test(i.rack) && /^[A-Z]*(?![\s\S])/.test(i.word));
  const deficit = H.groups(i.word.split(""), (x) => x).flatMap((g) => {
    const missing =
      g.indexes.length - i.rack.split("").filter((x) => x === g.key).length;
    return missing > 0 ? [{ letter: g.key, missing }] : [];
  });
  return H.finish({ canForm: deficit.length === 0, deficit });
};
export const example = {
  input: { rack: "AABC", word: "ABBA" },
  output: {
    result: { canForm: false, deficit: [{ letter: "B", missing: 1 }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/board-rack-letter-multiset-check",
  title: "Board Rack Letter Multiset Check",
  description:
    "Check literal uppercase ASCII rack multiplicities against a word; no dictionary, blank tiles, scoring or language inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
