import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly tinAssayMassPercent: number;
  readonly copperAssayMassPercent: number;
  readonly otherDeclaredMassPercent: number;
}>;
export type Output = Readonly<{
  readonly tinPercentOfMeasuredCopperTin: number;
  readonly declaredAssayTotalMassPercent: number;
  readonly undeclaredMassPercent: number;
}>;
const inputFields = [
  {
    id: "tinAssayMassPercent",
    label: "Tin assay mass percent",
    kind: "number",
  },
  {
    id: "copperAssayMassPercent",
    label: "Copper assay mass percent",
    kind: "number",
  },
  {
    id: "otherDeclaredMassPercent",
    label: "Other declared mass percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.tinAssayMassPercent, "tinAssayMassPercent");
  nonnegative(input.copperAssayMassPercent, "copperAssayMassPercent");
  nonnegative(input.otherDeclaredMassPercent, "otherDeclaredMassPercent");
  const declaredAssayTotalMassPercent =
    input.tinAssayMassPercent +
    input.copperAssayMassPercent +
    input.otherDeclaredMassPercent;
  if (declaredAssayTotalMassPercent > 100)
    simpleError("assay", "Declared mass percentages cannot exceed 100.");
  return {
    tinPercentOfMeasuredCopperTin:
      (100 * input.tinAssayMassPercent) /
      positive(
        input.tinAssayMassPercent + input.copperAssayMassPercent,
        "copperTin",
      ),
    declaredAssayTotalMassPercent,
    undeclaredMassPercent: 100 - declaredAssayTotalMassPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tinAssayMassPercent: 8,
  copperAssayMassPercent: 72,
  otherDeclaredMassPercent: 10,
} satisfies Input;
export const exampleOutput = {
  tinPercentOfMeasuredCopperTin: 10,
  declaredAssayTotalMassPercent: 90,
  undeclaredMassPercent: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/copper-alloy-tin-percent",
  title: "Copper Alloy Tin Percent",
  description:
    "Report measured tin share on the copper-plus-tin subsystem and incomplete declared assay closure; undeclared material is not automatically copper or an alloy identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "tinPercentOfMeasuredCopperTin",
      label: "Tin percent of measured copper tin",
      kind: "number",
    },
    {
      id: "declaredAssayTotalMassPercent",
      label: "Declared assay total mass percent",
      kind: "number",
    },
    {
      id: "undeclaredMassPercent",
      label: "Undeclared mass percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tinAssayMassPercent: value.tinAssayMassPercent as number,
      copperAssayMassPercent: value.copperAssayMassPercent as number,
      otherDeclaredMassPercent: value.otherDeclaredMassPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
