import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ bits: number; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bits", label: "bits", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.bits, 1, 128);
  let value = 1n;
  for (let j = 1; j < i.bits; j++)
    value = (value << 1n) | BigInt(H.randint(0, 1, random));
  return H.finish({
    seed: i.seed,
    value: String(value),
    binary: value.toString(2),
  });
};
export const example = {
  input: { bits: 4, seed: "batch56" },
  output: { result: { seed: "batch56", value: "15", binary: "1111" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Specified Bit-Length Integer", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/specified-bit-length-integer",
  title: "Random Specified Bit-Length Integer",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Generate an exact unsigned integer with a specified positive bit length, setting the top bit and drawing remaining bits independently; integer text avoids unsafe numbers.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seed: { type: "string" },
          value: { type: "string" },
          binary: { type: "string" },
        },
        required: ["seed", "value", "binary"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
