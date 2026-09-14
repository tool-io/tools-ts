import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualOriginalGroupFlagLabels: readonly string[];
  readonly actualSubstitutePennantOrdinal: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOriginalGroupFlagLabels",
    label: "Actual original group flag labels",
    kind: "stringList",
  },
  {
    id: "actualSubstitutePennantOrdinal",
    label: "Actual substitute pennant ordinal",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(input.actualSubstitutePennantOrdinal, "substitute", 1, 3);
  if (
    input.actualOriginalGroupFlagLabels.length <
      input.actualSubstitutePennantOrdinal ||
    input.actualOriginalGroupFlagLabels.some((v) => !/^[A-Z0-9]$/.test(v))
  )
    simpleError(
      "group",
      "Originalalreadyresolvedsameclassgroupflagscover referencedordinal.",
    );
  return {
    repeatedOriginalFlag:
      input.actualOriginalGroupFlagLabels[
        input.actualSubstitutePennantOrdinal - 1
      ],
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
    actualOriginalGroupFlagLabels: ["A", "B"],
    actualSubstitutePennantOrdinal: 1,
  },
  output: { result: { repeatedOriginalFlag: "A" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/substitute-pennant-decoder",
  title: "Substitute Pennant Position Decoder",
  description:
    "ICSfirst/second/thirdsubstituterepeatsALREADYRESOLVEDsame-classoriginalgroupordinal,not recursive decodingormixedpennant/letterclass inference. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
