import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualHorseHeartGirthCm: number;
  readonly actualHorseBodyLengthCm: number;
  readonly callerIndependentHorseModelDenominator: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHorseHeartGirthCm",
    label: "Actual horse heart girth cm",
    kind: "number",
  },
  {
    id: "actualHorseBodyLengthCm",
    label: "Actual horse body length cm",
    kind: "number",
  },
  {
    id: "callerIndependentHorseModelDenominator",
    label: "Caller independent horse model denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualHorseHeartGirthCm, "actualHorseHeartGirthCm");
  positive(input.actualHorseBodyLengthCm, "actualHorseBodyLengthCm");
  positive(
    input.callerIndependentHorseModelDenominator,
    "callerIndependentHorseModelDenominator",
  );
  return {
    value:
      (input.actualHorseHeartGirthCm ** 2 * input.actualHorseBodyLengthCm) /
      input.callerIndependentHorseModelDenominator,
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualHorseHeartGirthCm: 100,
    actualHorseBodyLengthCm: 100,
    callerIndependentHorseModelDenominator: 10000,
  },
  output: { result: { value: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "veterinary/equine-weight-body-length-formula",
  title: "Equine Weight Body Length Formula Calculator",
  description:
    "Qualifiedhorseregressionmasskg=girthcm\u00b2bodylengthcm/independentmatchedcoefficient,not cattlebodylengthrule or measuredweight. Actualage/breed/bodycondition/calibrationexternal;not drugdoseor feedingselection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
