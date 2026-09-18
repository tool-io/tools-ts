import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  pressure: number;
  minimum: number;
  maximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pressure", label: "pressure", kind: "integer" },
  { id: "minimum", label: "minimum", kind: "number" },
  { id: "maximum", label: "maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.pressure, 0, 127);
  H.check(i.maximum >= i.minimum);
  return H.finish({
    value: i.minimum + ((i.maximum - i.minimum) * i.pressure) / 127,
  });
};
export const example = {
  input: { pressure: 127, minimum: -1, maximum: 1 },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/channel-pressure-range-map",
  title: "MIDI Channel Pressure Range Map",
  description:
    "Map an explicit seven-bit MIDI channel pressure to a caller-supplied ascending finite numeric range; linear caller model, not synth-specific response.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
