import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualVerticalFoundationForceNewtons: number;
  readonly actualMatContactAreaSquareMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualVerticalFoundationForceNewtons",
    label: "Actual vertical foundation force new tons",
    kind: "number",
  },
  {
    id: "actualMatContactAreaSquareMeters",
    label: "Actual mat contact area square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualMatContactAreaSquareMeters,
    "actualMatContactAreaSquareMeters",
  );
  return {
    value:
      input.actualVerticalFoundationForceNewtons /
      input.actualMatContactAreaSquareMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualVerticalFoundationForceNewtons: 10,
    actualMatContactAreaSquareMeters: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/foundation-mat-pressure",
  title: "Mat Foundation Pressure Calculator",
  description:
    "Ideal uniform mat foundation averageq=N/A, not eccentric maximum/contact separation, bearing capacity or ground movement. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
