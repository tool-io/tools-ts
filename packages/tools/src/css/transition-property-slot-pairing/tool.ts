import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  properties: readonly string[];
  durations: readonly number[];
  delays: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "properties", label: "properties", kind: "stringList" },
  { id: "durations", label: "durations", kind: "numberList" },
  { id: "delays", label: "delays", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.durations.length > 0 &&
      i.delays.length > 0 &&
      i.durations.every((x) => x >= 0),
  );
  return H.finish({
    slots: i.properties.map((name, j) => ({
      name,
      duration: i.durations[j % i.durations.length],
      delay: i.delays[j % i.delays.length],
    })),
  });
};
export const example = {
  input: { properties: ["a", "b", "c"], durations: [1, 2], delays: [0] },
  output: {
    result: {
      slots: [
        { name: "a", duration: 1, delay: 0 },
        { name: "b", duration: 2, delay: 0 },
        { name: "c", duration: 1, delay: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/transition-property-slot-pairing",
  title: "CSS Transition Property Slot Pairing",
  description:
    "Pair explicit transition properties with cyclic duration/delay lists; no shorthand parsing, timing interpolation or special all/none expansion.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
