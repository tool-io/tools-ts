import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  pillarStems: readonly number[];
  dayKnown: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pillarStems", label: "Pillar stems", kind: "numberList" },
  { id: "dayKnown", label: "Day known", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.pillarStems.length === 4);
  i.pillarStems.forEach((x) => H.int(x, 0, 9));
  return H.finish({
    known: i.dayKnown,
    dayStemIndex: i.dayKnown ? i.pillarStems[2] : -1,
  });
};
export const example = {
  input: { pillarStems: [0, 2, 4, 6], dayKnown: true },
  output: { result: { known: true, dayStemIndex: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bazi/day-master-identification",
  title: "BaZi Day Master Identifier",
  description:
    "Extract the day stem from explicitly ordered year/month/day/hour pillar stems; unknown day remains flagged with index -1, with no traits or prediction.",
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
          dayStemIndex: { type: "number" },
          known: { type: "boolean" },
        },
        required: ["dayStemIndex", "known"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
