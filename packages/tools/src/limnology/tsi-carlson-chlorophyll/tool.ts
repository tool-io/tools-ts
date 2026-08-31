import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{ readonly chlorophyllMicrogramsLiter: number }>;
export type Output = Readonly<{ readonly carlsonTrophicStateIndex: number }>;
const inputFields = [
  {
    id: "chlorophyllMicrogramsLiter",
    label: "Chlorophyll micrograms liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.chlorophyllMicrogramsLiter, "chlorophyllMicrogramsLiter");
  return {
    carlsonTrophicStateIndex:
      9.81 * Math.log(input.chlorophyllMicrogramsLiter) + 30.6,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { chlorophyllMicrogramsLiter: 1 } satisfies Input;
export const exampleOutput = {
  carlsonTrophicStateIndex: 30.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/tsi-carlson-chlorophyll",
  title: "TSI Carlson Chlorophyll Calculator",
  description:
    "Apply Carlson chlorophyll TSI in µg/L with natural logarithm; pigment index does not uniquely classify all lake types.",
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
      chlorophyllMicrogramsLiter: value.chlorophyllMicrogramsLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
