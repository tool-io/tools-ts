import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ cas: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cas", label: "Cas", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    shapeValid: /^[1-9]\d{1,6}-\d{2}-\d(?![\s\S])/.test(i.cas),
    checksumChecked: false,
  });
};
export const example = {
  input: { cas: "64-17-5" },
  output: { result: { shapeValid: true, checksumChecked: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "validate/cas-three-part-digit-shape",
  title: "Validation: Cas Three Part Digit Shape Tool",
  description:
    "Check only the three-part CAS Registry Number digit/hyphen shape, explicitly not its check digit or substance registry.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          checksumChecked: { type: "boolean" },
          shapeValid: { type: "boolean" },
        },
        required: ["checksumChecked", "shapeValid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
