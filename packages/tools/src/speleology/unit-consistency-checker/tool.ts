import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualDistanceUnitTags: readonly string[];
  readonly actualAngleUnitTags: readonly string[];
  readonly callerRequiredDistanceUnit: string;
  readonly callerRequiredAngleUnit: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualDistanceUnitTags",
    label: "Actual distance unit tags",
    kind: "stringList",
  },
  {
    id: "actualAngleUnitTags",
    label: "Actual angle unit tags",
    kind: "stringList",
  },
  {
    id: "callerRequiredDistanceUnit",
    label: "Caller required distance unit",
    kind: "string",
  },
  {
    id: "callerRequiredAngleUnit",
    label: "Caller required angle unit",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  aligned(input.actualDistanceUnitTags, input.actualAngleUnitTags, "shots");
  if (
    !input.callerRequiredDistanceUnit.trim() ||
    !input.callerRequiredAngleUnit.trim() ||
    [...input.actualDistanceUnitTags, ...input.actualAngleUnitTags].some(
      (v) => !v.trim(),
    )
  )
    simpleError("units", "Actual nonblank declared units.");
  return {
    distanceMismatchIndices: input.actualDistanceUnitTags.flatMap((v, i) =>
      v === input.callerRequiredDistanceUnit ? [] : [i],
    ),
    angleMismatchIndices: input.actualAngleUnitTags.flatMap((v, i) =>
      v === input.callerRequiredAngleUnit ? [] : [i],
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDistanceUnitTags: ["m", "m"],
    actualAngleUnitTags: ["degrees", "degrees"],
    callerRequiredDistanceUnit: "m",
    callerRequiredAngleUnit: "degrees",
  },
  output: { result: { distanceMismatchIndices: [], angleMismatchIndices: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/unit-consistency-checker",
  title: "Shot Data Unit Consistency Checker",
  description:
    "Exact actual shot declared-unit tags versus explicit callerrequired units, not conversion or inference from bare numbers.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distanceMismatchIndices: { type: "array", items: { type: "number" } },
          angleMismatchIndices: { type: "array", items: { type: "number" } },
        },
        required: ["distanceMismatchIndices", "angleMismatchIndices"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
