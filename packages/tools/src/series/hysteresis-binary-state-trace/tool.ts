import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{
  values: readonly number[];
  lowerThreshold: number;
  upperThreshold: number;
  initialState: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "numberList" },
  { id: "lowerThreshold", label: "Lower threshold", kind: "number" },
  { id: "upperThreshold", label: "Upper threshold", kind: "number" },
  { id: "initialState", label: "Initial state", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.lowerThreshold, i.upperThreshold, true);
  let state = i.initialState;
  return {
    states: i.values.map((v) => {
      if (v >= i.upperThreshold) state = true;
      else if (v <= i.lowerThreshold) state = false;
      return state;
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    values: [0, 2, 1, 0],
    lowerThreshold: 0,
    upperThreshold: 2,
    initialState: false,
  },
  output: { result: { states: [false, true, true, false] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/hysteresis-binary-state-trace",
  title: "Hysteresis Binary State Trace",
  description:
    "Trace explicit hysteresis state with inclusive outer thresholds and state retention strictly inside the band.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
