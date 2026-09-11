import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerPhaseDetectorGain: number;
  readonly callerVcoGainRadiansPerSecondVolt: number;
  readonly callerLoopFilterTimeConstantSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerPhaseDetectorGain",
    label: "Caller phase detector gain",
    kind: "number",
  },
  {
    id: "callerVcoGainRadiansPerSecondVolt",
    label: "Caller vco gain radians per second volt",
    kind: "number",
  },
  {
    id: "callerLoopFilterTimeConstantSeconds",
    label: "Caller loop filter time constant seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerPhaseDetectorGain, "callerPhaseDetectorGain");
  positive(
    input.callerVcoGainRadiansPerSecondVolt,
    "callerVcoGainRadiansPerSecondVolt",
  );
  positive(
    input.callerLoopFilterTimeConstantSeconds,
    "callerLoopFilterTimeConstantSeconds",
  );
  return {
    value:
      Math.sqrt(
        (input.callerPhaseDetectorGain *
          input.callerVcoGainRadiansPerSecondVolt) /
          input.callerLoopFilterTimeConstantSeconds,
      ) /
      (2 * Math.PI),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerPhaseDetectorGain: 1,
    callerVcoGainRadiansPerSecondVolt: 4,
    callerLoopFilterTimeConstantSeconds: 1,
  },
  output: { result: { value: 0.3183098861837907 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/pll-natural-frequency",
  title: "Pll Natural Frequency Calculator",
  description:
    "Declared second order type II charge/phase detector loop naturalfHz=\u221a(KdKv/\u03c4)/(2\u03c0), unit-loop gain/dimensioned gains no hiddenN; actual effective gain includes divider. Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
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
