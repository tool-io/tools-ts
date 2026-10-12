import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bits", kind: "string", label: "bits" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ runs: H.bitRuns(i.bits, "0") });
};
export const example = {
  input: { bits: "110001" },
  output: { result: { runs: [{ start: 2, end: 5 }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-zero-run-table",
  title: "Bit String Zero Run Table",
  description:
    "Inventory maximal half-open 0-bit runs in a bounded linear string; no circular merging or compression.",
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
          runs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                start: { type: "number" },
                end: { type: "number" },
              },
              required: ["start", "end"],
            },
          },
        },
        required: ["runs"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
