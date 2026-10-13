import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  simpleError,
  quantile,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly observedValues: readonly number[];
  readonly classes: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "observedValues", label: "Observed values", kind: "numberList" },
  { id: "classes", label: "Classes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (!i.observedValues.length) simpleError("values", "Nonempty observations.");
  bounded(i.classes, "classes", 1, Math.min(128, i.observedValues.length));
  const a = [...i.observedValues].sort((a, b) => a - b);
  return {
    breaks: Array.from({ length: i.classes + 1 }, (_, j) =>
      quantile(a, j / i.classes),
    ),
    tiesMayCollapseClasses: new Set(a).size < i.classes,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { observedValues: [0, 10, 20, 30, 40], classes: 2 },
  output: { result: { breaks: [0, 20, 40], tiesMayCollapseClasses: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/choropleth-class-breaks-quantiles",
  title: "Choropleth Class Break Quantiles Calculator",
  description:
    "Type-7 linearly interpolated empirical quantile class boundaries; ties retained and no guaranteed equal member count.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          breaks: { type: "array", items: { type: "number" } },
          tiesMayCollapseClasses: { type: "boolean" },
        },
        required: ["breaks", "tiesMayCollapseClasses"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
