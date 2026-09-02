import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        ptolemaic:
          "Ptolemaic rule is centered on Egypt with changing external possessions.",
        seleucid:
          "Seleucid rule encompasses changing territories in Asia, including Syrian and Mesopotamian centers.",
        antigonid:
          "Antigonid rule becomes associated with Macedon, after changing early successor struggles.",
        limitation:
          "Choose an independently established date and map source before assigning precise frontiers.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "ptolemaic" },
  output: {
    result: {
      text: "Ptolemaic rule is centered on Egypt with changing external possessions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/diadochi-wars-successor-kingdoms-after-alexander-map-lookup",
  title: "Diadochi Wars Successor Kingdoms After Alexander Map Lookup",
  description:
    "Bounded offline reference: Successor kingdoms after Alexander developed through repeated wars, alliances and territorial changes. Source: Diodorus 18\u201320; Hellenistic history scholarship. Bounded core-region crosswalk, not a dated geospatial map or stable complete border atlas. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
