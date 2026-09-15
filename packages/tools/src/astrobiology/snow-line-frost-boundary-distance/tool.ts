import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly luminositySolar: number;
  readonly callerSolarSnowlineAu: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "luminositySolar", label: "Luminosity solar", kind: "number" },
  {
    id: "callerSolarSnowlineAu",
    label: "Caller solar snowline au",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.luminositySolar, "luminosity");
  positive(i.callerSolarSnowlineAu, "reference");
  return {
    conditionalSnowlineAu:
      i.callerSolarSnowlineAu * Math.sqrt(i.luminositySolar),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { luminositySolar: 4, callerSolarSnowlineAu: 2.7 },
  output: { result: { conditionalSnowlineAu: 5.4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/snow-line-frost-boundary-distance",
  title: "Snow Line Frost Boundary Distance from Star Calculator",
  description:
    "Toy luminosity-square-root snow-line scaling about caller independently established solar-reference snow line; disk opacity/accretion evolution omitted.",
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
