import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{ readonly planetToStarFluxRatio: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "planetToStarFluxRatio",
    label: "Planet to star flux ratio",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.planetToStarFluxRatio, "ratio");
  return { signedDeltaMagnitude: -2.5 * Math.log10(i.planetToStarFluxRatio) };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { planetToStarFluxRatio: 0.0001 },
  output: { result: { signedDeltaMagnitude: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/direct-imaging-contrast-deltamag-calculator",
  title: "Direct Imaging Contrast Delta-Mag Planet-Star Requirement Calculator",
  description:
    "Astronomical magnitude contrast from actual positive flux ratio; no instrument detection criterion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { signedDeltaMagnitude: { type: "number" } },
        required: ["signedDeltaMagnitude"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
