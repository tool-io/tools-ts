import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  unique,
  ordered,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedHelmetHeadCircumferenceMm: number;
  readonly callerHelmetHeadCircumferenceLowerMm: readonly number[];
  readonly callerHelmetHeadCircumferenceUpperMm: readonly number[];
  readonly callerHelmetHeadCircumferenceSizeIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchingCallerSizeIds: readonly string[];
}>;
const inputFields = [
  {
    id: "observedHelmetHeadCircumferenceMm",
    label: "Observed helmet head circumference mm",
    kind: "number",
  },
  {
    id: "callerHelmetHeadCircumferenceLowerMm",
    label: "Caller helmet head circumference lower mm",
    kind: "numberList",
  },
  {
    id: "callerHelmetHeadCircumferenceUpperMm",
    label: "Caller helmet head circumference upper mm",
    kind: "numberList",
  },
  {
    id: "callerHelmetHeadCircumferenceSizeIds",
    label: "Caller helmet head circumference size ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerHelmetHeadCircumferenceLowerMm,
    input.callerHelmetHeadCircumferenceUpperMm,
    "callerHelmetHeadCircumferenceLowerMm",
  );
  aligned(
    input.callerHelmetHeadCircumferenceLowerMm,
    input.callerHelmetHeadCircumferenceSizeIds,
    "callerHelmetHeadCircumferenceLowerMm",
  );
  positive(input.observedHelmetHeadCircumferenceMm, "measurement");
  unique(input.callerHelmetHeadCircumferenceSizeIds, "sizes");
  input.callerHelmetHeadCircumferenceLowerMm.forEach((v, i) =>
    ordered(v, input.callerHelmetHeadCircumferenceUpperMm[i]),
  );
  return {
    matchingCallerSizeIds: input.callerHelmetHeadCircumferenceSizeIds.filter(
      (_, i) =>
        input.observedHelmetHeadCircumferenceMm >=
          input.callerHelmetHeadCircumferenceLowerMm[i] &&
        input.observedHelmetHeadCircumferenceMm <=
          input.callerHelmetHeadCircumferenceUpperMm[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHelmetHeadCircumferenceMm: 200,
  callerHelmetHeadCircumferenceLowerMm: [180, 200],
  callerHelmetHeadCircumferenceUpperMm: [200, 220],
  callerHelmetHeadCircumferenceSizeIds: ["a", "b"],
} satisfies Input;
export const exampleOutput = {
  matchingCallerSizeIds: ["a", "b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/head-circumference-helmet-mapper",
  title: "Anthropometric Head Circumference Helmet Size Mapper",
  description:
    "Measured head circumference caller exact model/edition helmet sizing chart, no safety/fit certification. Overlaps/boundaries retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchingCallerSizeIds",
      label: "Matching caller size ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHelmetHeadCircumferenceMm:
        value.observedHelmetHeadCircumferenceMm as number,
      callerHelmetHeadCircumferenceLowerMm:
        value.callerHelmetHeadCircumferenceLowerMm as readonly number[],
      callerHelmetHeadCircumferenceUpperMm:
        value.callerHelmetHeadCircumferenceUpperMm as readonly number[],
      callerHelmetHeadCircumferenceSizeIds:
        value.callerHelmetHeadCircumferenceSizeIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
