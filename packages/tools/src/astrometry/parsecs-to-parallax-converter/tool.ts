import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{ readonly distanceParsecs: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.distanceParsecs, "distance");
  return { idealParallaxMas: 1000 / i.distanceParsecs };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { distanceParsecs: 10 },
  output: { result: { idealParallaxMas: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/parsecs-to-parallax-converter",
  title: "Parsecs to Parallax Angle Converter",
  description:
    "Ideal reciprocal distance-to-parallax in milliarcseconds; no measured parallax bias, uncertainty or catalog inversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { idealParallaxMas: { type: "number" } },
        required: ["idealParallaxMas"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
