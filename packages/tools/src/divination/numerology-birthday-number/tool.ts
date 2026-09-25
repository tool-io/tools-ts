import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ dayOfMonth: number; masterPolicy: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dayOfMonth", label: "Day of month", kind: "integer" },
  {
    id: "masterPolicy",
    label: "Master policy",
    kind: "string",
    enum: ["reduce-all", "preserve-11-22"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.dayOfMonth, 1, 31);
  H.choice(i.masterPolicy, ["reduce-all", "preserve-11-22"]);
  const preserved =
    i.masterPolicy === "preserve-11-22" && [11, 22].includes(i.dayOfMonth);
  return H.finish({
    birthdayNumber: preserved ? i.dayOfMonth : 1 + ((i.dayOfMonth - 1) % 9),
    preservedMaster: preserved,
  });
};
export const example = {
  input: { dayOfMonth: 29, masterPolicy: "reduce-all" },
  output: { result: { birthdayNumber: 2, preservedMaster: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "divination/numerology-birthday-number",
  title: "Numerology Birthday Number Calculator",
  description:
    "Compute a symbolic day-of-month digit reduction with an explicit optional 11/22 retention policy; distinct from a full-date number and no predictive validity claimed.",
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
          birthdayNumber: { type: "number" },
          preservedMaster: { type: "boolean" },
        },
        required: ["birthdayNumber", "preservedMaster"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
