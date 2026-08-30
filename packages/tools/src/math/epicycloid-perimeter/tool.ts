import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly rollingRadius: number;
  readonly fixedToRollingRadiusIntegerRatio: number;
}>;
export type Output = Readonly<{ readonly curveMeasure: number }>;
const inputFields = [
  { id: "rollingRadius", label: "Rolling radius", kind: "number" },
  {
    id: "fixedToRollingRadiusIntegerRatio",
    label: "Fixed to rolling radius integer ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rollingRadius, "rollingRadius");
  const k = bounded(
      input.fixedToRollingRadiusIntegerRatio,
      "ratio",
      1,
      1000000,
    ),
    r = input.rollingRadius;
  return { curveMeasure: 8 * r * (k + 1) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rollingRadius: 1,
  fixedToRollingRadiusIntegerRatio: 3,
} satisfies Input;
export const exampleOutput = { curveMeasure: 32 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/epicycloid-perimeter",
  title: "Epicycloid Perimeter Calculator",
  description:
    "Exact full simple closed integer-ratio epicycloid perimeter; ratio specifies cusps, not a special named-shape alias or rational-ratio multiply traced curve.",
  inputs: inputFields,
  outputs: [{ id: "curveMeasure", label: "Curve measure", kind: "number" }],
  calculate: (value) =>
    calculate({
      rollingRadius: value.rollingRadius as number,
      fixedToRollingRadiusIntegerRatio:
        value.fixedToRollingRadiusIntegerRatio as number,
    }),
});
export const run = tool.execute;
export default tool;
