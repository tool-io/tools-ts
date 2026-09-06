import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly independentlyAnnotatedBarCount: number;
  readonly independentlyAnnotatedWaveCount: number;
}>;
export type Output = Readonly<{
  readonly barCount: number;
  readonly waveCount: number;
}>;
const inputFields = [
  {
    id: "independentlyAnnotatedBarCount",
    label: "Independently annotated bar count",
    kind: "number",
  },
  {
    id: "independentlyAnnotatedWaveCount",
    label: "Independently annotated wave count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.independentlyAnnotatedBarCount, "bars", 0, 10000);
  bounded(input.independentlyAnnotatedWaveCount, "waves", 0, 10000);
  return {
    barCount: input.independentlyAnnotatedBarCount,
    waveCount: input.independentlyAnnotatedWaveCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyAnnotatedBarCount: 6,
  independentlyAnnotatedWaveCount: 3,
} satisfies Input;
export const exampleOutput = { barCount: 6, waveCount: 3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/killer-bar-wave-counter",
  title: "Killer Bar Wave Count Decoder",
  description:
    "Return independently annotated killer bar and wave counts without inferring cancellation machinery or authenticity. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "barCount", label: "Bar count", kind: "number" },
    { id: "waveCount", label: "Wave count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      independentlyAnnotatedBarCount:
        value.independentlyAnnotatedBarCount as number,
      independentlyAnnotatedWaveCount:
        value.independentlyAnnotatedWaveCount as number,
    }),
});
export const run = tool.execute;
export default tool;
