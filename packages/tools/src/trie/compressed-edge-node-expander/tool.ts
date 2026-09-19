import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ edgesJson: string; rootTerminal: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgesJson", label: "edgesJson", kind: "string" },
  { id: "rootTerminal", label: "rootTerminal", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const e = H.records(i.edgesJson).map((v) => {
    H.check(typeof v.terminal === "boolean");
    const from = H.int(H.num(v.from), 0, 127),
      to = H.int(H.num(v.to), 1, 127),
      label = H.str(v.label);
    H.check(label.length > 0 && label.length <= 127);
    return { from, to, label, terminal: v.terminal as boolean };
  });
  H.check(
    H.unique(e.map((v) => v.to)).length === e.length &&
      H.duplicates(e, (v) => JSON.stringify([v.from, v.label[0]])).length === 0,
  );
  const nodes = [
    { id: "0", parent: null as string | null },
    ...e.map((v) => ({ id: String(v.to), parent: String(v.from) })),
  ];
  H.forest(nodes);
  const words: string[] = i.rootTerminal ? [""] : [];
  for (const v of e) {
    let word = v.label,
      p = v.from;
    while (p !== 0) {
      const parent = e.find((x) => x.to === p);
      H.check(parent);
      word = parent!.label + word;
      p = parent!.from;
    }
    if (v.terminal) words.push(word);
    H.check(
      v.terminal || e.some((x) => x.from === v.to),
      "Nonterminal leaves would be lost",
    );
  }
  H.check(e.every((v) => v.from === 0 || e.some((x) => x.to === v.from)));
  return H.finish({ nodes: H.makeTrie(words) });
};
export const example = {
  input: {
    edgesJson: '[{"from":0,"to":2,"label":"ab","terminal":true}]',
    rootTerminal: false,
  },
  output: {
    result: {
      nodes: [
        { id: 0, parent: null, character: "", terminal: false },
        { id: 1, parent: 0, character: "a", terminal: false },
        { id: 2, parent: 1, character: "b", terminal: true },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "trie/compressed-edge-node-expander",
  title: "Prefix Trie Compressed Edge Node Expander",
  description:
    "Expand an explicit compressed rooted trie edge table into stable insertion-code-unit nodes, validating complete unique-parent acyclic structure and unambiguous outgoing first characters; IDs are reallocated, not preserved.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
