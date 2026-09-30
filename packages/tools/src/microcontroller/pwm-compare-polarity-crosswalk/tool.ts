import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  periodTicks: number;
  compareTicks: number;
  polarity: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "periodTicks", label: "Period ticks", kind: "integer" },
  { id: "compareTicks", label: "Compare ticks", kind: "integer" },
  {
    id: "polarity",
    label: "Polarity",
    kind: "string",
    enum: ["noninverting", "inverting"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.periodTicks, 1, 1000000000);
  H.int(i.compareTicks, 0, i.periodTicks);
  H.choice(i.polarity, ["noninverting", "inverting"]);
  return H.finish({
    activeTicks:
      i.polarity === "noninverting"
        ? i.compareTicks
        : i.periodTicks - i.compareTicks,
    dutyFraction:
      i.polarity === "noninverting"
        ? i.compareTicks / i.periodTicks
        : 1 - i.compareTicks / i.periodTicks,
  });
};
export const example = {
  input: { periodTicks: 10, compareTicks: 3, polarity: "inverting" },
  output: { result: { activeTicks: 7, dutyFraction: 0.7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/pwm-compare-polarity-crosswalk",
  title: "Microcontroller: PWM Compare Polarity Crosswalk Tool",
  description:
    "Resolve edge-aligned ideal PWM active ticks under an explicit inversion convention, assuming compare counts active ticks directly and excluding device-specific endpoint quirks.",
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
          activeTicks: { type: "number" },
          dutyFraction: { type: "number" },
        },
        required: ["activeTicks", "dutyFraction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
