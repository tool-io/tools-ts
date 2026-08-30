import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly dbhCm: readonly number[];
  readonly naslundA: number;
  readonly naslundB: number;
  readonly breastHeightM: number;
}>;
export type Output = Readonly<{
  readonly modelTreeHeightsM: readonly number[];
}>;
const inputFields = [
  { id: "dbhCm", label: "Dbh cm", kind: "numberList" },
  { id: "naslundA", label: "Naslund a", kind: "number" },
  { id: "naslundB", label: "Naslund b", kind: "number" },
  { id: "breastHeightM", label: "Breast height m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.dbhCm.forEach((v) => positive(v, "dbhCm"));
  positive(input.naslundA, "naslundA");
  nonnegative(input.naslundB, "naslundB");
  nonnegative(input.breastHeightM, "breastHeightM");
  return {
    modelTreeHeightsM: input.dbhCm.map(
      (d) =>
        input.breastHeightM + (d / (input.naslundA + input.naslundB * d)) ** 2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dbhCm: [10, 20],
  naslundA: 1,
  naslundB: 0.1,
  breastHeightM: 1.3,
} satisfies Input;
export const exampleOutput = {
  modelTreeHeightsM: [26.3, 45.74444444444444],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/height-curve-naslund",
  title: "Näslund Height Curve",
  description:
    "Evaluate caller calibrated Näslund h=breast height+(d/(a+b d))² with explicit cm/metre calibration convention; no universal species curve or measured height lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelTreeHeightsM",
      label: "Model tree heights m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      dbhCm: value.dbhCm as readonly number[],
      naslundA: value.naslundA as number,
      naslundB: value.naslundB as number,
      breastHeightM: value.breastHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
