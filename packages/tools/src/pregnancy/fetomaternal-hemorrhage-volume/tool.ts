import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyVerifiedFetalCellPercent: number;
  readonly callerClinicallyEstablishedMaternalBloodVolumeMl: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyVerifiedFetalCellPercent",
    label: "Independently verified fetal cell percent",
    kind: "number",
  },
  {
    id: "callerClinicallyEstablishedMaternalBloodVolumeMl",
    label: "Caller clinically established maternal blood volume ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyVerifiedFetalCellPercent < 0 ||
    input.independentlyVerifiedFetalCellPercent > 100
  )
    simpleError("percent", "Actual0–100fetal-cell percent.");
  positive(input.callerClinicallyEstablishedMaternalBloodVolumeMl, "volume");
  return {
    conditionalFetalCellEquivalentVolumeMl:
      (input.independentlyVerifiedFetalCellPercent / 100) *
      input.callerClinicallyEstablishedMaternalBloodVolumeMl,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyVerifiedFetalCellPercent: 1,
    callerClinicallyEstablishedMaternalBloodVolumeMl: 5000,
  },
  output: { result: { conditionalFetalCellEquivalentVolumeMl: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/fetomaternal-hemorrhage-volume",
  title: "Fetomaternal Hemorrhage Volume Calculator",
  description:
    "Conditional fetal-cell-equivalent volume from independently verified laboratory percent and clinically established matched maternal volume. RBC/whole-blood convention, assay corrections and clinical decisions external; not prescribe RhIGor diagnose haemorrhage.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
