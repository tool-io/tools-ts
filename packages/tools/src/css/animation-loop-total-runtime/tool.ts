import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly durationSeconds: number;
  readonly iterationCount: number;
  readonly delaySeconds: number;
  readonly infiniteIterations: boolean;
}>;
export type Output = Readonly<{
  readonly finiteActiveRuntimeSeconds: number;
  readonly finiteCompletionAfterStartSeconds: number;
  readonly isUnbounded: boolean;
}>;
const inputFields = [
  { id: "durationSeconds", label: "Duration seconds", kind: "number" },
  { id: "iterationCount", label: "Iteration count", kind: "number" },
  { id: "delaySeconds", label: "Delay seconds", kind: "number" },
  { id: "infiniteIterations", label: "Infinite iterations", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.durationSeconds, "durationSeconds");
  nonnegative(input.iterationCount, "iterationCount");
  return {
    finiteActiveRuntimeSeconds: input.infiniteIterations
      ? 0
      : input.durationSeconds * input.iterationCount,
    finiteCompletionAfterStartSeconds: input.infiniteIterations
      ? 0
      : Math.max(
          0,
          input.durationSeconds * input.iterationCount + input.delaySeconds,
        ),
    isUnbounded: input.infiniteIterations,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  durationSeconds: 2,
  iterationCount: 2.5,
  delaySeconds: -1,
  infiniteIterations: false,
} satisfies Input;
export const exampleOutput = {
  finiteActiveRuntimeSeconds: 5,
  finiteCompletionAfterStartSeconds: 4,
  isUnbounded: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/animation-loop-total-runtime",
  title: "Animation Loop Total Runtime",
  description:
    "Finite/fractional animation iterations and signed delay; infinite explicitly flagged with zero placeholders, no Infinity output or inferred reduced-motion policy. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteActiveRuntimeSeconds",
      label: "Finite active runtime seconds",
      kind: "number",
    },
    {
      id: "finiteCompletionAfterStartSeconds",
      label: "Finite completion after start seconds",
      kind: "number",
    },
    { id: "isUnbounded", label: "Is unbounded", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      durationSeconds: value.durationSeconds as number,
      iterationCount: value.iterationCount as number,
      delaySeconds: value.delaySeconds as number,
      infiniteIterations: value.infiniteIterations as boolean,
    }),
});
export const run = tool.execute;
export default tool;
