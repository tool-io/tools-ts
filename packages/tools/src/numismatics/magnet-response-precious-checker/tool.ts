import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly observedFeatureFlags: readonly number[];
  readonly featureKnownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedFeatureFlags",
    label: "Observed feature flags",
    kind: "numberList",
  },
  { id: "featureKnownFlags", label: "Feature known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return featureClasses(
    input.observedFeatureFlags,
    input.featureKnownFlags,
    ["unexpected-attraction-review", "unexpected-nonattraction-review"],
    [
      [1, 0, 1],
      [0, 1, 1],
    ],
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 0, 1], featureKnownFlags: [1, 1, 1] },
  output: {
    result: {
      compatibleClasses: ["unexpected-attraction-review"],
      witnessedClasses: ["unexpected-attraction-review"],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/magnet-response-precious-checker",
  title: "Magnet Response Precious Checker",
  description:
    "Compare actual magnetic response with independently verified issue expectation, not precious-metal identity or authenticity; some genuine alloys/inserts are magnetic. Independently established columns: independently observed magnetic attraction, matched verified issue expected attraction, applicable observation conditions independently matched. Unknown observations and overlapping candidates retained; not automatic semantic parsing, proof of identity, fraud, authenticity, compliance or coverage.",
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
          compatibleClasses: { type: "array", items: { type: "string" } },
          witnessedClasses: { type: "array", items: { type: "string" } },
          unknownFeatureIndices: { type: "array", items: { type: "number" } },
        },
        required: [
          "compatibleClasses",
          "witnessedClasses",
          "unknownFeatureIndices",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
