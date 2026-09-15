import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.topic,
      {
        legacy:
          "msapplication-TileColor and TileImage were Microsoft pinned-site metadata; they are legacy hints, not current universal install metadata.",
      },
      "topic",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { topic: "legacy" },
  output: {
    result: {
      reference:
        "msapplication-TileColor and TileImage were Microsoft pinned-site metadata; they are legacy hints, not current universal install metadata.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/msapplication-tile-legacy-lookup",
  title: "MSApplication Tile Legacy Lookup",
  description:
    "Bounded HTML feature/convention note; no full document audit or live browser compatibility determination.",
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
