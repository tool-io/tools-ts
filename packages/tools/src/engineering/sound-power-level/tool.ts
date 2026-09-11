import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualSoundPowerWatts: number;
  readonly callerReferencePowerWatts: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSoundPowerWatts",
    label: "Actual sound power watts",
    kind: "number",
  },
  {
    id: "callerReferencePowerWatts",
    label: "Caller reference power watts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualSoundPowerWatts, "actualSoundPowerWatts");
  positive(input.callerReferencePowerWatts, "callerReferencePowerWatts");
  return {
    value:
      10 *
      Math.log10(input.actualSoundPowerWatts / input.callerReferencePowerWatts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualSoundPowerWatts: 10, callerReferencePowerWatts: 1 },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/sound-power-level",
  title: "Sound Power Level Calculator",
  description:
    "Sound POWER level10log10(W/Wref), actual independently matched acoustic power/reference. Not pressure level20log pressure or sound-field inference. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
