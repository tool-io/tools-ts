import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch52-shared.js";
export type Input = Readonly<{ readonly panFraction: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "panFraction", label: "Pan fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  fraction(i.panFraction, "pan");
  return { leftAmplitudeGain: Math.cos((i.panFraction * Math.PI) / 2) };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { panFraction: 0.5 },
  output: { result: { leftAmplitudeGain: 0.7071067811865476 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/stereo-pan-law-minus-3db-center",
  title: "Stereo Pan Law −3dB Center Attenuation",
  description:
    "Left channel constant-power pan gain for mono input, -3.0103 dB at center; right gain is sin(theta), correlated signals can differ.",
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
