import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly nativeFocalMm: number;
  readonly callerMatchedBarlowGain: number;
}>;
export type Output = Readonly<{ readonly effectiveFocalMm: number }>;
const inputFields = [
  { id: "nativeFocalMm", label: "Native focal mm", kind: "number" },
  {
    id: "callerMatchedBarlowGain",
    label: "Caller matched barlow gain",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.nativeFocalMm, "nativeFocalMm");
  positive(input.callerMatchedBarlowGain, "callerMatchedBarlowGain");
  return {
    effectiveFocalMm: input.nativeFocalMm * input.callerMatchedBarlowGain,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  nativeFocalMm: 1000,
  callerMatchedBarlowGain: 2,
} satisfies Input;
export const exampleOutput = { effectiveFocalMm: 2000 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/barlow-effective-focal-length",
  title: "Barlow Effective Focal Length",
  description:
    "Focal-length scaling from independently measured gain at actual Barlow spacing, not nominal device magnification always exact. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "effectiveFocalMm", label: "Effective focal mm", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      nativeFocalMm: value.nativeFocalMm as number,
      callerMatchedBarlowGain: value.callerMatchedBarlowGain as number,
    }),
});
export const run = tool.execute;
export default tool;
