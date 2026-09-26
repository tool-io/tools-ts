import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  reactivePower: number;
  sourceConvention: string;
  targetConvention: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "reactivePower", label: "Reactive power", kind: "number" },
  {
    id: "sourceConvention",
    label: "Source convention",
    kind: "string",
    enum: ["load-positive", "generator-positive"],
  },
  {
    id: "targetConvention",
    label: "Target convention",
    kind: "string",
    enum: ["load-positive", "generator-positive"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.sourceConvention, ["load-positive", "generator-positive"]);
  H.choice(i.targetConvention, ["load-positive", "generator-positive"]);
  return H.finish({
    reactivePower:
      i.sourceConvention === i.targetConvention
        ? i.reactivePower
        : -i.reactivePower,
  });
};
export const example = {
  input: {
    reactivePower: 3,
    sourceConvention: "load-positive",
    targetConvention: "generator-positive",
  },
  output: { result: { reactivePower: -3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/reactive-power-sign-convention-crosswalk",
  title: "Electricity: Reactive Power Sign Convention Crosswalk Tool",
  description:
    "Crosswalk the sign of one supplied reactive-power value between explicitly declared load-positive and generator-positive conventions; not a grid stability assessment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reactivePower: { type: "number" } },
        required: ["reactivePower"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
