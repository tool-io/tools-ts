import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, correlationKnown } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerRegionPeriodIds: readonly string[];
  readonly independentlyMatchedUnemploymentMeasures: readonly number[];
  readonly independentlyMatchedRecordedCrimeMeasures: readonly number[];
  readonly pairedKnownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerRegionPeriodIds",
    label: "Caller region period ids",
    kind: "stringList",
  },
  {
    id: "independentlyMatchedUnemploymentMeasures",
    label: "Independently matched unemployment measures",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedRecordedCrimeMeasures",
    label: "Independently matched recorded crime measures",
    kind: "numberList",
  },
  { id: "pairedKnownFlags", label: "Paired known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return correlationKnown(
    input.callerRegionPeriodIds,
    input.independentlyMatchedUnemploymentMeasures,
    input.independentlyMatchedRecordedCrimeMeasures,
    input.pairedKnownFlags,
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerRegionPeriodIds: ["a", "b", "c"],
    independentlyMatchedUnemploymentMeasures: [1, 2, 3],
    independentlyMatchedRecordedCrimeMeasures: [3, 2, 1],
    pairedKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      observedKnownCorrelation: -1,
      includedCallerIds: ["a", "b", "c"],
      unknownCallerIds: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/unemployment-crime-correlation-calculator",
  title: "Unemployment Crime Correlation Calculator",
  description:
    "Actual independently harmonized known regional-period correlation, composing existing Pearson calculation and retaining unresolved IDs. Correlation does not establish causation or individual criminality.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedKnownCorrelation: { type: "number" },
          includedCallerIds: { type: "array", items: { type: "string" } },
          unknownCallerIds: { type: "array", items: { type: "string" } },
        },
        required: [
          "observedKnownCorrelation",
          "includedCallerIds",
          "unknownCallerIds",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
