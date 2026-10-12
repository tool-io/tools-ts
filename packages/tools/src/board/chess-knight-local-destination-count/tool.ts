import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ square: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "square", kind: "string", label: "square" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const [x, y] = H.square(i.square),
    destinations = H.knight(x, y);
  return H.finish({ count: destinations.length });
};
export const example = {
  input: { square: "a1" },
  output: { result: { count: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "board/chess-knight-local-destination-count",
  title: "Chess Knight Local Destination Count",
  description:
    "Enumerate the count of one-step knight destinations on an empty 8\u00d78 board; excludes occupancy, checks and legal-position state.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { count: { type: "number" } },
        required: ["count"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
