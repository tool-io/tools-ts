import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly halfLifeYears: number;
  readonly minimumSurvivingFraction: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "halfLifeYears", label: "Half life years", kind: "number" },
  {
    id: "minimumSurvivingFraction",
    label: "Minimum surviving fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.halfLifeYears, "half-life");
  positive(i.minimumSurvivingFraction, "fraction");
  fraction(i.minimumSurvivingFraction, "fraction");
  return {
    conditionalMaximumYears:
      -i.halfLifeYears * Math.log2(i.minimumSurvivingFraction),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { halfLifeYears: 500, minimumSurvivingFraction: 0.125 },
  output: { result: { conditionalMaximumYears: 1500 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/dna-halflife-bone-age-bound-calculator",
  title: "DNA Half-Life Bone Deposition Age Degradation Bound Calculator",
  description:
    "Conditional maximum age at a caller minimum surviving fraction under constant first-order DNA half-life; no calendar dating, recovery or identity inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalMaximumYears: { type: "number" } },
        required: ["conditionalMaximumYears"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
