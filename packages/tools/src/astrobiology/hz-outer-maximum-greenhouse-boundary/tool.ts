import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly luminositySolar: number;
  readonly callerOuterEffectiveFlux: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "luminositySolar", label: "Luminosity solar", kind: "number" },
  {
    id: "callerOuterEffectiveFlux",
    label: "Caller outer effective flux",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.luminositySolar, "luminosity");
  positive(i.callerOuterEffectiveFlux, "flux");
  return {
    conditionalOuterRadiusAu: Math.sqrt(
      i.luminositySolar / i.callerOuterEffectiveFlux,
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { luminositySolar: 1, callerOuterEffectiveFlux: 0.25 },
  output: { result: { conditionalOuterRadiusAu: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/hz-outer-maximum-greenhouse-boundary",
  title: "Habitable Zone Outer Maximum Greenhouse Boundary Calculator",
  description:
    "Conditional maximum-greenhouse HZ outer radius in AU using independently applicable effective flux; no atmospheric/habitability calculation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalOuterRadiusAu: { type: "number" } },
        required: ["conditionalOuterRadiusAu"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
