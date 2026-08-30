import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly measuredDelta13C: number;
  readonly tissueDietOffsetPerMil: number;
  readonly c3DietEndmemberPerMil: number;
  readonly c4DietEndmemberPerMil: number;
}>;
export type Output = Readonly<{
  readonly offsetCorrectedDietDelta13C: number;
  readonly modelC4Fraction: number;
  readonly modelC3Fraction: number;
}>;
const inputFields = [
  { id: "measuredDelta13C", label: "Measured delta13 c", kind: "number" },
  {
    id: "tissueDietOffsetPerMil",
    label: "Tissue diet offset per mil",
    kind: "number",
  },
  {
    id: "c3DietEndmemberPerMil",
    label: "C3 diet endmember per mil",
    kind: "number",
  },
  {
    id: "c4DietEndmemberPerMil",
    label: "C4 diet endmember per mil",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.c3DietEndmemberPerMil === input.c4DietEndmemberPerMil)
    simpleError("endmembers", "Distinct consistent endmembers required.");
  const offsetCorrectedDietDelta13C =
      input.measuredDelta13C - input.tissueDietOffsetPerMil,
    modelC4Fraction = fraction(
      (offsetCorrectedDietDelta13C - input.c3DietEndmemberPerMil) /
        (input.c4DietEndmemberPerMil - input.c3DietEndmemberPerMil),
      "measuredDelta13C",
    );
  return {
    offsetCorrectedDietDelta13C,
    modelC4Fraction,
    modelC3Fraction: 1 - modelC4Fraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredDelta13C: -15,
  tissueDietOffsetPerMil: 5,
  c3DietEndmemberPerMil: -25,
  c4DietEndmemberPerMil: -10,
} satisfies Input;
export const exampleOutput = {
  offsetCorrectedDietDelta13C: -20,
  modelC4Fraction: 0.3333333333333333,
  modelC3Fraction: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/diet-delta13c-c3-c4-mix",
  title: "Delta13C C3/C4 Diet Mix",
  description:
    "Solve a caller two-endmember linear delta13C diet scenario with explicit tissue offset; assumes equal carbon routing and consistent isotope basis, not identified foods or an actual diet diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "offsetCorrectedDietDelta13C",
      label: "Offset corrected diet delta13 c",
      kind: "number",
    },
    { id: "modelC4Fraction", label: "Model c4 fraction", kind: "number" },
    { id: "modelC3Fraction", label: "Model c3 fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      measuredDelta13C: value.measuredDelta13C as number,
      tissueDietOffsetPerMil: value.tissueDietOffsetPerMil as number,
      c3DietEndmemberPerMil: value.c3DietEndmemberPerMil as number,
      c4DietEndmemberPerMil: value.c4DietEndmemberPerMil as number,
    }),
});
export const run = tool.execute;
export default tool;
