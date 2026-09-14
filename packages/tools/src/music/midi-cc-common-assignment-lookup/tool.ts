import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly controller: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "controller", label: "Controller", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.controller,
      {
        "0": "Bank Select MSB",
        "1": "Modulation Wheel",
        "7": "Channel Volume",
        "10": "Pan",
        "11": "Expression",
        "32": "Bank Select LSB",
        "64": "Damper Pedal",
        "65": "Portamento On/Off",
        "66": "Sostenuto",
        "67": "Soft Pedal",
        "91": "Effects 1 Depth (reverb)",
        "93": "Effects 3 Depth (chorus)",
        "120": "All Sound Off",
        "121": "Reset All Controllers",
        "123": "All Notes Off",
      },
      "controller",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { controller: "7" },
  output: { result: { reference: "Channel Volume" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/midi-cc-common-assignment-lookup",
  title: "MIDI CC Common Assignment Lookup",
  description:
    "Bounded common MIDI 1.0 controller assignments; device implementation and channel-mode behavior may vary.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
