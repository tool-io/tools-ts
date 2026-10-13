import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualExcavatedInPlaceVolume: number;
  readonly callerIndependentlyMeasuredLooseToBankVolumeFactor: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualExcavatedInPlaceVolume",
    label: "Actual excavated in place volume",
    kind: "number",
  },
  {
    id: "callerIndependentlyMeasuredLooseToBankVolumeFactor",
    label: "Caller independently measured loose to bank volume factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualExcavatedInPlaceVolume,
    "actualExcavatedInPlaceVolume",
  );
  positive(
    input.callerIndependentlyMeasuredLooseToBankVolumeFactor,
    "callerIndependentlyMeasuredLooseToBankVolumeFactor",
  );
  return {
    value:
      input.actualExcavatedInPlaceVolume *
      input.callerIndependentlyMeasuredLooseToBankVolumeFactor,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualExcavatedInPlaceVolume: 10,
    callerIndependentlyMeasuredLooseToBankVolumeFactor: 1.2,
  },
  output: { result: { value: 12 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/excavation-spoil-pile-volume",
  title: "Spoil Pile Volume Calculator",
  description:
    "Loose spoil pile volume actual bank volume\u00d7independentbulkingratio; not bare excavation rectangle or universals oil factor. Actual independently established design/material/calibration and matched units; not a safe work instruction, code compliance or engineering approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
