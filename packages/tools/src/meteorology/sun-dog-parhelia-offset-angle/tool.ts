import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, deg } from "../batch52-shared.js";
export type Input = Readonly<{ readonly iceRefractiveIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "iceRefractiveIndex", label: "Ice refractive index", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (i.iceRefractiveIndex <= 1 || i.iceRefractiveIndex >= 2)
    simpleError("index", "1<n<2 for transmitted prism branch.");
  return {
    minimumDeviationDegrees:
      deg(2 * Math.asin(i.iceRefractiveIndex * 0.5)) - 60,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { iceRefractiveIndex: 1.31 },
  output: { result: { minimumDeviationDegrees: 21.839299909773032 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/sun-dog-parhelia-offset-angle",
  title: "Sun Dog Parhelia Offset Angle Calculator",
  description:
    "Minimum-deviation geometric offset through a 60-degree ice prism, ideal horizontal ray branch; not a full solar-altitude parhelion model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
