import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ valuesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "valuesJson", kind: "string", label: "valuesJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const values = H.arr(i.valuesJson).map(
    (value): string | number | boolean | null => {
      if (
        value === null ||
        typeof value === "string" ||
        typeof value === "boolean" ||
        typeof value === "number"
      )
        return value;
      return simpleError("", "Invalid domain evidence");
    },
  );
  return H.finish({
    counts: H.groups(values, (x) => JSON.stringify(x)).map((g) => ({
      value: values[g.indexes[0]],
      count: g.indexes.length,
    })),
  });
};
export const example = {
  input: { valuesJson: '[1,"1",1,true,null]' },
  output: {
    result: {
      counts: [
        { value: 1, count: 2 },
        { value: "1", count: 1 },
        { value: true, count: 1 },
        { value: null, count: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "multiset/typed-value-count-table",
  title: "Typed Value Count Table",
  description:
    "Count typed JSON scalar occurrences, preserving number/string/boolean/null identity; unlike a string frequency counter it does not coerce keys.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counts: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                value: {
                  anyOf: [
                    { type: "null" },
                    { type: "boolean" },
                    { type: "number" },
                    { type: "string" },
                  ],
                },
                count: { type: "integer", minimum: 0 },
              },
              required: ["value", "count"],
            },
          },
        },
        required: ["counts"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
