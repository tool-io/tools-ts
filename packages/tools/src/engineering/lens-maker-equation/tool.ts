import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly relativeIndex: number;
  readonly firstSignedRadiusMeters: number;
  readonly secondSignedRadiusMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "relativeIndex", label: "Relative index", kind: "number" },
  {
    id: "firstSignedRadiusMeters",
    label: "First signed radius meters",
    kind: "number",
  },
  {
    id: "secondSignedRadiusMeters",
    label: "Second signed radius meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.relativeIndex, "relativeIndex");
  if (
    input.relativeIndex === 1 ||
    input.firstSignedRadiusMeters === 0 ||
    input.secondSignedRadiusMeters === 0 ||
    input.firstSignedRadiusMeters === input.secondSignedRadiusMeters
  )
    simpleError("lens", "Finite nonzero thin lens power.");
  return {
    value:
      1 /
      ((input.relativeIndex - 1) *
        (1 / input.firstSignedRadiusMeters -
          1 / input.secondSignedRadiusMeters)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    relativeIndex: 2,
    firstSignedRadiusMeters: 2,
    secondSignedRadiusMeters: -2,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/lens-maker-equation",
  title: "Lens Maker Equation Calculator",
  description:
    "Ideal thin lens maker1/f=(nrel\u22121)(1/R1\u22121/R2), actual signed optical convention, infinite/zero cases refused. No thick lens/dispersion. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
