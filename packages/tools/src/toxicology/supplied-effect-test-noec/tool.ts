import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly concentrations: readonly number[];
  readonly effectPValues: readonly number[];
  readonly alpha: number;
}>;
export type Output = Readonly<{
  readonly noEffectConcentration: number;
  readonly firstSignificantConcentration: number;
  readonly monotoneSignificancePattern: boolean;
}>;
const inputFields = [
  { id: "concentrations", label: "Concentrations", kind: "numberList" },
  { id: "effectPValues", label: "Effect p values", kind: "numberList" },
  { id: "alpha", label: "Alpha", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.concentrations, "concentrations");
  aligned(input.concentrations, input.effectPValues, "concentrations");
  if (input.concentrations[0] !== 0)
    simpleError(
      "concentrations",
      "First concentration must be zero-dose control.",
    );
  input.effectPValues.forEach((v) => fraction(v, "effectPValues"));
  fraction(input.alpha, "alpha");
  if (input.alpha === 0 || input.alpha === 1)
    simpleError("alpha", "Interior alpha required.");
  const significant = input.effectPValues.slice(1).map((v) => v < input.alpha),
    first = significant.indexOf(true);
  if (first < 0)
    simpleError(
      "effectPValues",
      "No observed significant effect; NOEC is right-censored beyond the tested range.",
    );
  return {
    noEffectConcentration: input.concentrations[first],
    firstSignificantConcentration: input.concentrations[first + 1],
    monotoneSignificancePattern: significant.slice(first).every(Boolean),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  concentrations: [0, 1, 2, 4],
  effectPValues: [1, 0.8, 0.3, 0.01],
  alpha: 0.05,
} satisfies Input;
export const exampleOutput = {
  noEffectConcentration: 2,
  firstSignificantConcentration: 4,
  monotoneSignificancePattern: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/supplied-effect-test-noec",
  title: "NOEC",
  description:
    "Extract the tested NOEC immediately below the first significant concentration from caller-supplied effect tests; report nonmonotone significance, and no-effect series remain right-censored errors.",
  inputs: inputFields,
  outputs: [
    {
      id: "noEffectConcentration",
      label: "No effect concentration",
      kind: "number",
    },
    {
      id: "firstSignificantConcentration",
      label: "First significant concentration",
      kind: "number",
    },
    {
      id: "monotoneSignificancePattern",
      label: "Monotone significance pattern",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      concentrations: value.concentrations as readonly number[],
      effectPValues: value.effectPValues as readonly number[],
      alpha: value.alpha as number,
    }),
});
export const run = tool.execute;
export default tool;
