import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  parseJson,
  jsonNodes,
} from "../batch53-shared.js";

export type Input = Readonly<{ documentJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  const a = jsonNodes(parseJson(i.documentJson)),
    m = new Map<number, number>();
  a.forEach((v) => m.set(v.depth, (m.get(v.depth) ?? 0) + 1));
  return {
    maximumDepth: Math.max(...a.map((v) => v.depth)),
    nodesPerDepth: [...m]
      .sort((a, b) => a[0] - b[0])
      .map(([depth, count]) => ({ depth, count })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { documentJson: '{"a":[1]}' },
  output: {
    result: {
      maximumDepth: 2,
      nodesPerDepth: [
        { depth: 0, count: 1 },
        { depth: 1, count: 1 },
        { depth: 2, count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-depth-profile",
  title: "JSON Depth Profile",
  description:
    "Profile JSON node depths with root depth zero, counting containers and scalar leaves explicitly.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          maximumDepth: { type: "number" },
          nodesPerDepth: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                depth: { type: "number" },
                count: { type: "number" },
              },
              required: ["depth", "count"],
            },
          },
        },
        required: ["maximumDepth", "nodesPerDepth"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
