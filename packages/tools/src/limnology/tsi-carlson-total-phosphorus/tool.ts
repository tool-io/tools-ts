import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly totalPhosphorusMicrogramsLiter: number;
}>;
export type Output = Readonly<{ readonly carlsonTrophicStateIndex: number }>;
const inputFields = [
  {
    id: "totalPhosphorusMicrogramsLiter",
    label: "Total phosphorus micrograms liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.totalPhosphorusMicrogramsLiter,
    "totalPhosphorusMicrogramsLiter",
  );
  return {
    carlsonTrophicStateIndex:
      14.42 * Math.log(input.totalPhosphorusMicrogramsLiter) + 4.15,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalPhosphorusMicrogramsLiter: 1,
} satisfies Input;
export const exampleOutput = {
  carlsonTrophicStateIndex: 4.15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/tsi-carlson-total-phosphorus",
  title: "TSI Carlson Total Phosphorus Calculator",
  description:
    "Apply Carlson total-phosphorus TSI in µg/L; empirical nutrient index, not bioavailability, permit limit or ecological diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "carlsonTrophicStateIndex",
      label: "Carlson trophic state index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      totalPhosphorusMicrogramsLiter:
        value.totalPhosphorusMicrogramsLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
