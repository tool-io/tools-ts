import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, deg } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly eastwardUphillGradient: number;
  readonly northwardUphillGradient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "eastwardUphillGradient",
    label: "Eastward uphill gradient",
    kind: "number",
  },
  {
    id: "northwardUphillGradient",
    label: "Northward uphill gradient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (i.eastwardUphillGradient === 0 && i.northwardUphillGradient === 0)
    return { downhillAspect: "flat", bearingDegrees: 0 };
  const a =
    (deg(Math.atan2(-i.eastwardUphillGradient, -i.northwardUphillGradient)) +
      360) %
    360;
  return {
    downhillAspect: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][
      Math.floor((a + 22.5) / 45) % 8
    ],
    bearingDegrees: a,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { eastwardUphillGradient: 1, northwardUphillGradient: 0 },
  output: { result: { downhillAspect: "W", bearingDegrees: 270 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/aspect-octant-classifier",
  title: "Aspect Direction Octant Classifier from Slope Components",
  description:
    "Downhill compass aspect from explicitly east/north uphill partial derivatives; flat separately reported, half-octant boundaries round clockwise.",
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
