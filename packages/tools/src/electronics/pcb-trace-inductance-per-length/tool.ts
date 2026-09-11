import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualTraceLengthMeters: number;
  readonly actualWidthMeters: number;
  readonly actualThicknessMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTraceLengthMeters",
    label: "Actual trace length meters",
    kind: "number",
  },
  { id: "actualWidthMeters", label: "Actual width meters", kind: "number" },
  {
    id: "actualThicknessMeters",
    label: "Actual thickness meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualTraceLengthMeters, "actualTraceLengthMeters");
  positive(input.actualWidthMeters, "actualWidthMeters");
  positive(input.actualThicknessMeters, "actualThicknessMeters");
  if (
    input.actualTraceLengthMeters <
    10 * (input.actualWidthMeters + input.actualThicknessMeters)
  )
    simpleError("geometry", "Long isolated trace branch.");
  return {
    value:
      2e-7 *
      (Math.log(
        (2 * input.actualTraceLengthMeters) /
          (input.actualWidthMeters + input.actualThicknessMeters),
      ) +
        0.5 +
        (input.actualWidthMeters + input.actualThicknessMeters) /
          (3 * input.actualTraceLengthMeters)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTraceLengthMeters: 1,
    actualWidthMeters: 0.01,
    actualThicknessMeters: 0.01,
  },
  output: { result: { value: 1.0223673705309518e-6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/pcb-trace-inductance-per-length",
  title: "Pcb Trace Inductance Per Length Calculator",
  description:
    "Restricted straight isolated rectangular trace partial inductance PER LENGTH approximation, not loop/return-plane inductance or micro strip field solver; long trace L\u226510(w+t). Actual matched units/topology and independently established parameters; not a safe device/electrical design or verified manufacturer rating.",
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
