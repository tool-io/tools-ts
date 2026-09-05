import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly callerDbhCm: number;
  readonly callerKozak1969Coefficients: readonly number[];
  readonly observedRelativeStemHeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly kozak1969DiameterCm: readonly number[];
}>;
const inputFields = [
  { id: "callerDbhCm", label: "Caller dbh cm", kind: "number" },
  {
    id: "callerKozak1969Coefficients",
    label: "Caller kozak 1969 coefficients",
    kind: "numberList",
  },
  {
    id: "observedRelativeStemHeights",
    label: "Observed relative stem heights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerDbhCm, "callerDbhCm");
  input.observedRelativeStemHeights.forEach((v) =>
    fraction(v, "observedRelativeStemHeights"),
  );
  if (input.callerKozak1969Coefficients.length !== 3)
    simpleError(
      "coefficients",
      "Explicit Kozak 1969 quadratic coefficients required.",
    );
  const [a, b, c] = input.callerKozak1969Coefficients;
  return {
    kozak1969DiameterCm: input.observedRelativeStemHeights.map((z) => {
      const sq = a + b * z + c * z * z;
      if (sq < 0)
        simpleError(
          "diameter",
          "Nonnegative squared diameter model branch required.",
        );
      return input.callerDbhCm * Math.sqrt(sq);
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDbhCm: 10,
  callerKozak1969Coefficients: [1, -1, 0],
  observedRelativeStemHeights: [0, 0.5, 1],
} satisfies Input;
export const exampleOutput = {
  kozak1969DiameterCm: [10, 7.071067811865475, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/taper-curve-kozak",
  title: "Kozak Taper Curve Calculator",
  description:
    "Explicit Kozak 1969 squared relative diameter quadratic, not later variable-exponent Kozak editions or linear taper; independently calibrated coefficients/unit convention. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "kozak1969DiameterCm",
      label: "Kozak 1969 diameter cm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDbhCm: value.callerDbhCm as number,
      callerKozak1969Coefficients:
        value.callerKozak1969Coefficients as readonly number[],
      observedRelativeStemHeights:
        value.observedRelativeStemHeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
