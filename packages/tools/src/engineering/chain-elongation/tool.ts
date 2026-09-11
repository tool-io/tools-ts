import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredChainPitchLength: number;
  readonly actualNominalChainPitchLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredChainPitchLength",
    label: "Actual measured chain pitch length",
    kind: "number",
  },
  {
    id: "actualNominalChainPitchLength",
    label: "Actual nominal chain pitch length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualMeasuredChainPitchLength,
    "actualMeasuredChainPitchLength",
  );
  positive(
    input.actualNominalChainPitchLength,
    "actualNominalChainPitchLength",
  );
  return {
    value:
      (100 *
        (input.actualMeasuredChainPitchLength -
          input.actualNominalChainPitchLength)) /
      input.actualNominalChainPitchLength,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredChainPitchLength: 6,
    actualNominalChainPitchLength: 5,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/chain-elongation",
  title: "Chain Elongation Calculator",
  description:
    "Actual chain percent elongation under independently matched measurement preload/length; negative discrepancy retained, not retirement criterion. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
