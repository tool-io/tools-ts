import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerPlateNondimensionalSlenderness: readonly number[];
  readonly grossPlateWidthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly winterEffectivePlateWidthsM: readonly number[];
}>;
const inputFields = [
  {
    id: "callerPlateNondimensionalSlenderness",
    label: "Caller plate nondimensional slenderness",
    kind: "numberList",
  },
  {
    id: "grossPlateWidthsM",
    label: "Gross plate widths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerPlateNondimensionalSlenderness.forEach((v) =>
    positive(v, "callerPlateNondimensionalSlenderness"),
  );
  input.grossPlateWidthsM.forEach((v) => positive(v, "grossPlateWidthsM"));
  aligned(
    input.callerPlateNondimensionalSlenderness,
    input.grossPlateWidthsM,
    "callerPlateNondimensionalSlenderness",
  );
  return {
    winterEffectivePlateWidthsM: input.callerPlateNondimensionalSlenderness.map(
      (v, i) =>
        input.grossPlateWidthsM[i] * (v <= 0.673 ? 1 : (1 - 0.22 / v) / v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPlateNondimensionalSlenderness: [0.5, 1, 2],
  grossPlateWidthsM: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  winterEffectivePlateWidthsM: [1, 0.78, 0.445],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/cold-formed-effective-width",
  title: "Cold-Formed Effective Width Calculator",
  description:
    "Named Winter effective-width reductionρ=1 forλ≤.673 else(1−.22/λ)/λ, independently verified uniform-compression plate branch; not all cold-formed code rules. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "winterEffectivePlateWidthsM",
      label: "Winter effective plate widths m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPlateNondimensionalSlenderness:
        value.callerPlateNondimensionalSlenderness as readonly number[],
      grossPlateWidthsM: value.grossPlateWidthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
