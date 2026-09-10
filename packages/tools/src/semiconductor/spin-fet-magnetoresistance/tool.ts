import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualParallelStateResistanceOhms: number;
  readonly actualAntiparallelStateResistanceOhms: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualParallelStateResistanceOhms",
    label: "Actual parallel state resistance ohms",
    kind: "number",
  },
  {
    id: "actualAntiparallelStateResistanceOhms",
    label: "Actual antiparallel state resistance ohms",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualParallelStateResistanceOhms, "parallel");
  positive(input.actualAntiparallelStateResistanceOhms, "antiparallel");
  return {
    signedObservedMagnetoresistancePercent:
      100 *
      (input.actualAntiparallelStateResistanceOhms /
        input.actualParallelStateResistanceOhms -
        1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualParallelStateResistanceOhms: 100,
    actualAntiparallelStateResistanceOhms: 120,
  },
  output: { result: { signedObservedMagnetoresistancePercent: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/spin-fet-magnetoresistance",
  title: "Semiconductor Spin Fet Magnetoresistance Calculator",
  description:
    "Actual same-condition spin-device antiparallel-minus-parallel resistance normalized by parallel resistance. Not ideal transistor functionality, spin polarization or a predicted universal magnetoresistance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
