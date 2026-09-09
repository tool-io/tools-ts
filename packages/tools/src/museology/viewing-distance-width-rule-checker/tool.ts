import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedObjectWidthMeters: number;
  readonly observedViewingDistanceMeters: number;
  readonly callerRequiredDistanceWidthMultiple: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedObjectWidthMeters",
    label: "Observed object width meters",
    kind: "number",
  },
  {
    id: "observedViewingDistanceMeters",
    label: "Observed viewing distance meters",
    kind: "number",
  },
  {
    id: "callerRequiredDistanceWidthMultiple",
    label: "Caller required distance width multiple",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedObjectWidthMeters, "width");
  nonnegative(input.observedViewingDistanceMeters, "distance");
  positive(input.callerRequiredDistanceWidthMultiple, "multiple");
  const r =
    input.observedViewingDistanceMeters / input.observedObjectWidthMeters;
  return {
    observedDistanceWidthRatio: r,
    meetsCallerDistanceScreen: r >= input.callerRequiredDistanceWidthMultiple,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedObjectWidthMeters: 2,
    observedViewingDistanceMeters: 3,
    callerRequiredDistanceWidthMultiple: 2,
  },
  output: {
    result: {
      observedDistanceWidthRatio: 1.5,
      meetsCallerDistanceScreen: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/viewing-distance-width-rule-checker",
  title: "Object Viewing Distance Minimum Rule by Width Checker",
  description:
    "Observed distance/object-width ratio relative to independently applicable caller display rule. Not universal art-viewing distance, full object visibility, accessibility or crowd-safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
