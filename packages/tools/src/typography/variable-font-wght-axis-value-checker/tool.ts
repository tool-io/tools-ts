import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, range } from "../shared.js";
export type Input = Readonly<{
  readonly requestedAxisWeight: number;
  readonly declaredAxisBounds: readonly number[];
  readonly declaredNamedInstanceWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly axisValueWithinFontBounds: boolean;
  readonly resolvedClampedAxisValue: number;
  readonly exactNamedInstanceFound: boolean;
}>;
const inputFields = [
  { id: "requestedAxisWeight", label: "Requested axis weight", kind: "number" },
  {
    id: "declaredAxisBounds",
    label: "Declared axis bounds",
    kind: "numberList",
  },
  {
    id: "declaredNamedInstanceWeights",
    label: "Declared named instance weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  range(input.declaredAxisBounds, "axisBounds");
  input.declaredAxisBounds.forEach((v) => positive(v, "weight"));
  input.declaredNamedInstanceWeights.forEach((v) => {
    if (v < input.declaredAxisBounds[0] || v > input.declaredAxisBounds[1])
      simpleError("instances", "Named weights must lie inside axis bounds.");
  });
  return {
    axisValueWithinFontBounds:
      input.requestedAxisWeight >= input.declaredAxisBounds[0] &&
      input.requestedAxisWeight <= input.declaredAxisBounds[1],
    resolvedClampedAxisValue: Math.max(
      input.declaredAxisBounds[0],
      Math.min(input.declaredAxisBounds[1], input.requestedAxisWeight),
    ),
    exactNamedInstanceFound: input.declaredNamedInstanceWeights.includes(
      input.requestedAxisWeight,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requestedAxisWeight: 550,
  declaredAxisBounds: [300, 700],
  declaredNamedInstanceWeights: [400, 600],
} satisfies Input;
export const exampleOutput = {
  axisValueWithinFontBounds: true,
  resolvedClampedAxisValue: 550,
  exactNamedInstanceFound: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/variable-font-wght-axis-value-checker",
  title: "Variable Font wght Axis Value Check",
  description:
    "Check actual variable-font wght range and exact declared named instances, retaining original out-of-range flag despite clamped value; no universal weight-name mapping or outline availability claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "axisValueWithinFontBounds",
      label: "Axis value within font bounds",
      kind: "boolean",
    },
    {
      id: "resolvedClampedAxisValue",
      label: "Resolved clamped axis value",
      kind: "number",
    },
    {
      id: "exactNamedInstanceFound",
      label: "Exact named instance found",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      requestedAxisWeight: value.requestedAxisWeight as number,
      declaredAxisBounds: value.declaredAxisBounds as readonly number[],
      declaredNamedInstanceWeights:
        value.declaredNamedInstanceWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
