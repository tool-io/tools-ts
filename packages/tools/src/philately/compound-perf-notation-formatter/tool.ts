import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly horizontalGauge: number;
  readonly verticalGauge: number;
}>;
export type Output = Readonly<{ readonly compoundNotation: string }>;
const inputFields = [
  { id: "horizontalGauge", label: "Horizontal gauge", kind: "number" },
  { id: "verticalGauge", label: "Vertical gauge", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.horizontalGauge, "horizontalGauge");
  positive(input.verticalGauge, "verticalGauge");
  return {
    compoundNotation: `${input.horizontalGauge}x${input.verticalGauge}`,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  horizontalGauge: 11,
  verticalGauge: 12.5,
} satisfies Input;
export const exampleOutput = { compoundNotation: "11x12.5" } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/compound-perf-notation-formatter",
  title: "Compound Perforation Notation Formatter (e.g. 11x12.5)",
  description:
    "Format explicit horizontal x vertical perforation gauge; no gauge inference. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    { id: "compoundNotation", label: "Compound notation", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      horizontalGauge: value.horizontalGauge as number,
      verticalGauge: value.verticalGauge as number,
    }),
});
export const run = tool.execute;
export default tool;
