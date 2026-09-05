import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldHeight: number;
  readonly observedFessCenterY: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldHeight", label: "Field height", kind: "number" },
  {
    id: "observedFessCenterY",
    label: "Observed fess center y",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.fieldHeight, "fieldHeight");
  if (
    input.observedFessCenterY < 0 ||
    input.observedFessCenterY > input.fieldHeight
  )
    simpleError("center", "Inside declared envelope.");
  return {
    signedCenterOffset: input.observedFessCenterY - input.fieldHeight / 2,
    normalizedCenterOffset: input.observedFessCenterY / input.fieldHeight - 0.5,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldHeight: 100, observedFessCenterY: 60 },
  output: { result: { signedCenterOffset: 10, normalizedCenterOffset: 0.1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/fess-center-offset",
  title: "Fess Center Line Offset Calculator",
  description:
    "Fess center offset in an explicit rectangular envelope, y down from top; no shield centroid inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
