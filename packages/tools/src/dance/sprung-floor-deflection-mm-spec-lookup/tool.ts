import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  interpolate,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerMatchedTestLoadsN: readonly number[];
  readonly callerObservedFloorDeflectionsMm: readonly number[];
  readonly queryMatchedTestLoadN: number;
  readonly callerAllowedDeflectionRangeMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly interpolatedObservedFloorDeflectionMm: number;
  readonly withinCallerMatchedDeflectionSpec: boolean;
}>;
const inputFields = [
  {
    id: "callerMatchedTestLoadsN",
    label: "Caller matched test loads n",
    kind: "numberList",
  },
  {
    id: "callerObservedFloorDeflectionsMm",
    label: "Caller observed floor deflections mm",
    kind: "numberList",
  },
  {
    id: "queryMatchedTestLoadN",
    label: "Query matched test load n",
    kind: "number",
  },
  {
    id: "callerAllowedDeflectionRangeMm",
    label: "Caller allowed deflection range mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedTestLoadsN.forEach((v) =>
    positive(v, "callerMatchedTestLoadsN"),
  );
  positive(input.queryMatchedTestLoadN, "queryMatchedTestLoadN");
  input.callerObservedFloorDeflectionsMm.forEach((v) =>
    nonnegative(v, "callerObservedFloorDeflectionsMm"),
  );
  input.callerAllowedDeflectionRangeMm.forEach((v) =>
    nonnegative(v, "callerAllowedDeflectionRangeMm"),
  );
  if (
    input.callerAllowedDeflectionRangeMm.length !== 2 ||
    input.callerAllowedDeflectionRangeMm[0] >
      input.callerAllowedDeflectionRangeMm[1]
  )
    simpleError("spec", "Explicit ordered caller deflection range required.");
  const d = interpolate(
    input.callerMatchedTestLoadsN,
    input.callerObservedFloorDeflectionsMm,
    input.queryMatchedTestLoadN,
  );
  return {
    interpolatedObservedFloorDeflectionMm: d,
    withinCallerMatchedDeflectionSpec:
      d >= input.callerAllowedDeflectionRangeMm[0] &&
      d <= input.callerAllowedDeflectionRangeMm[1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMatchedTestLoadsN: [100, 200, 300],
  callerObservedFloorDeflectionsMm: [1, 2, 4],
  queryMatchedTestLoadN: 250,
  callerAllowedDeflectionRangeMm: [2, 5],
} satisfies Input;
export const exampleOutput = {
  interpolatedObservedFloorDeflectionMm: 3,
  withinCallerMatchedDeflectionSpec: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/sprung-floor-deflection-mm-spec-lookup",
  title: "Sprung Floor Deflection Mm Spec Lookup",
  description:
    "Compare actual matched-protocol floor load/deflection calibration against explicit caller specification inside measured range; not invented dance-floor mm standard, impact absorption or injury/safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedObservedFloorDeflectionMm",
      label: "Interpolated observed floor deflection mm",
      kind: "number",
    },
    {
      id: "withinCallerMatchedDeflectionSpec",
      label: "Within caller matched deflection spec",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerMatchedTestLoadsN:
        value.callerMatchedTestLoadsN as readonly number[],
      callerObservedFloorDeflectionsMm:
        value.callerObservedFloorDeflectionsMm as readonly number[],
      queryMatchedTestLoadN: value.queryMatchedTestLoadN as number,
      callerAllowedDeflectionRangeMm:
        value.callerAllowedDeflectionRangeMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
