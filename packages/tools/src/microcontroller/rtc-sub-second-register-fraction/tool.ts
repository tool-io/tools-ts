import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  subsecondRegister: number;
  reload: number;
  countDirection: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "subsecondRegister", label: "Subsecond register", kind: "integer" },
  { id: "reload", label: "Reload", kind: "integer" },
  {
    id: "countDirection",
    label: "Count direction",
    kind: "string",
    enum: ["up", "down"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.reload, 0, 0xffffff);
  H.int(i.subsecondRegister, 0, i.reload);
  H.choice(i.countDirection, ["up", "down"]);
  return H.finish({
    elapsedFraction:
      i.countDirection === "down"
        ? (i.reload - i.subsecondRegister) / (i.reload + 1)
        : i.subsecondRegister / (i.reload + 1),
  });
};
export const example = {
  input: { subsecondRegister: 7, reload: 9, countDirection: "down" },
  output: { result: { elapsedFraction: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/rtc-sub-second-register-fraction",
  title: "Microcontroller: RTC Sub Second Register Fraction Tool",
  description:
    "Convert an explicit inclusive RTC subsecond counter value to elapsed fraction under a declared up/down convention; no device-specific latch or rollover assumptions.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { elapsedFraction: { type: "number" } },
        required: ["elapsedFraction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
