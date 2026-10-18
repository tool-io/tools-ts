import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  required: readonly string[];
  roles: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "required", kind: "stringList", label: "required" },
  { id: "roles", kind: "stringList", label: "roles" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(H.unique(i.required).length === i.required.length);
  return H.finish({
    missing: i.required.filter((x) => !i.roles.includes(x)),
    duplicates: H.duplicates(i.roles, (x) => x),
  });
};
export const example = {
  input: {
    required: ["foreground", "background"],
    roles: ["foreground", "foreground"],
  },
  output: {
    result: {
      missing: ["background"],
      duplicates: [{ key: "foreground", indexes: [0, 1] }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "palette/palette-role-coverage-check",
  title: "Palette Role Coverage Check",
  description:
    "Audit explicit required palette role coverage and duplicate assignments; no contrast, accessibility or theme completeness certification.",
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
          missing: { type: "array", items: { type: "string" } },
          duplicates: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
        },
        required: ["missing", "duplicates"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
