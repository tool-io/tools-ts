import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  budget: number;
  initialBytes: number;
  growthBytes: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "budget", kind: "integer", label: "budget" },
  { id: "initialBytes", kind: "integer", label: "initialBytes" },
  { id: "growthBytes", kind: "integer", label: "growthBytes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.budget);
  H.int(i.initialBytes, 1);
  H.int(i.growthBytes);
  let used = 0,
    records = 0;
  while (
    records < 128 &&
    used + i.initialBytes + records * i.growthBytes <= i.budget
  ) {
    used += i.initialBytes + records * i.growthBytes;
    records++;
  }
  H.check(
    records < 128 || used + i.initialBytes + records * i.growthBytes > i.budget,
    "Record output budget exceeded",
  );
  return H.finish({ records, used, remainder: i.budget - used });
};
export const example = {
  input: { budget: 20, initialBytes: 3, growthBytes: 2 },
  output: { result: { records: 3, used: 15, remainder: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "capacity/buffer-growing-record-budget",
  title: "Buffer Growing Record Budget",
  description:
    "Admit complete records whose byte sizes grow arithmetically from an explicit initial size; bounded to 128 records with signed residual budget evidence.",
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
          records: { type: "number" },
          used: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["records", "used", "remainder"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
