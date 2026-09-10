import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  trapezoid,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualInjectedTracerMass: number;
  readonly actualElapsedSeconds: readonly number[];
  readonly actualBackgroundCorrectedTracerConcentrations: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInjectedTracerMass",
    label: "Actual injected tracer mass",
    kind: "number",
  },
  {
    id: "actualElapsedSeconds",
    label: "Actual elapsed seconds",
    kind: "numberList",
  },
  {
    id: "actualBackgroundCorrectedTracerConcentrations",
    label: "Actual background corrected tracer concentrations",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualInjectedTracerMass, "mass");
  input.actualBackgroundCorrectedTracerConcentrations.forEach((v) =>
    nonnegative(v, "C"),
  );
  return {
    conditionalConstantSpringDischarge:
      input.actualInjectedTracerMass /
      positive(
        trapezoid(
          input.actualElapsedSeconds,
          input.actualBackgroundCorrectedTracerConcentrations,
        ),
        "integral",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualInjectedTracerMass: 4,
    actualElapsedSeconds: [0, 1, 2],
    actualBackgroundCorrectedTracerConcentrations: [0, 2, 0],
  },
  output: { result: { conditionalConstantSpringDischarge: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/spring-discharge-dilution-gauging",
  title: "Karst Spring Discharge Dilution Gauging Calculator",
  description:
    "Slug-dilution Q=actual injected mass/\u222bbackground-corrected Cdtunder independently complete recovery, constant flow and full mixing. Not dye observed recovery using separately measuredQor a safe stream-entry assessment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
