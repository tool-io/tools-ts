import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerMeasuredGuideNumberAtReferenceIso: number;
  readonly actualIso: number;
  readonly callerGuideNumberReferenceIso: number;
  readonly actualFlashSubjectDistance: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerMeasuredGuideNumberAtReferenceIso",
    label: "Caller measured guide number at reference iso",
    kind: "number",
  },
  { id: "actualIso", label: "Actual iso", kind: "number" },
  {
    id: "callerGuideNumberReferenceIso",
    label: "Caller guide number reference iso",
    kind: "number",
  },
  {
    id: "actualFlashSubjectDistance",
    label: "Actual flash subject distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.callerMeasuredGuideNumberAtReferenceIso,
    "callerMeasuredGuideNumberAtReferenceIso",
  );
  positive(input.actualIso, "actualIso");
  positive(
    input.callerGuideNumberReferenceIso,
    "callerGuideNumberReferenceIso",
  );
  positive(input.actualFlashSubjectDistance, "actualFlashSubjectDistance");
  return {
    value:
      (input.callerMeasuredGuideNumberAtReferenceIso *
        Math.sqrt(input.actualIso / input.callerGuideNumberReferenceIso)) /
      input.actualFlashSubjectDistance,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMeasuredGuideNumberAtReferenceIso: 20,
    actualIso: 100,
    callerGuideNumberReferenceIso: 100,
    actualFlashSubjectDistance: 2,
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/flash-exposure",
  title: "Flash Exposure Calculator",
  description:
    "Nominal direct flash fnumberGN/d\u00d7\u221a(ISO/ISOref), actual guide-number units/distance/reference independently established. Bounce/modifiers/nonuniform exposure external.",
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
