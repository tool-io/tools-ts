import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  expFinite,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualDownwindDistanceMeters: number;
  readonly callerFittedReferenceThicknessMeters: number;
  readonly callerFittedDecayLengthMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDownwindDistanceMeters",
    label: "Actual downwind distance meters",
    kind: "number",
  },
  {
    id: "callerFittedReferenceThicknessMeters",
    label: "Caller fitted reference thickness meters",
    kind: "number",
  },
  {
    id: "callerFittedDecayLengthMeters",
    label: "Caller fitted decay length meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualDownwindDistanceMeters, "distance");
  nonnegative(input.callerFittedReferenceThicknessMeters, "T0");
  positive(input.callerFittedDecayLengthMeters, "L");
  return {
    conditionalExponentialTephraThicknessMeters:
      input.callerFittedReferenceThicknessMeters *
      expFinite(
        -input.actualDownwindDistanceMeters /
          input.callerFittedDecayLengthMeters,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDownwindDistanceMeters: 1,
    callerFittedReferenceThicknessMeters: 10,
    callerFittedDecayLengthMeters: 2,
  },
  output: {
    result: { conditionalExponentialTephraThicknessMeters: 6.065306597126334 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/tephra-fall-thickness-exponential-decay",
  title: "Geology Tephra Fall Thickness Exponential Decay Calculator",
  description:
    "Declared fitted one-dimensional exponential tephra thicknessT0exp(\u2212x/L). Actual applicable transect and independently fit T0, Lrequired; no eruption forecast, total volume or fallout hazard approval.",
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
