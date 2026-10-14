import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, featureClasses } from "../batch44-shared.js";

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
    [
      "blessing-clause-candidate",
      "threat-clause-candidate",
      "forwarding-pressure-candidate",
    ],
    [
      [1, -1, 1],
      [-1, 1, 1],
      [-1, -1, 1],
    ],
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedFeatureFlags: [1, 1, 1], featureKnownFlags: [1, 1, 1] },
  output: {
    result: {
      compatibleClasses: [
        "blessing-clause-candidate",
        "threat-clause-candidate",
        "forwarding-pressure-candidate",
      ],
      witnessedClasses: [
        "blessing-clause-candidate",
        "threat-clause-candidate",
        "forwarding-pressure-candidate",
      ],
      unknownFeatureIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/chain-letter-blessing-threat-clause-classifier",
  title: "Chain Letter Blessing Threat Clause Classifier",
  description:
    "Audit caller annotated chain-letter rhetorical conditions, not supernatural consequences. Independently annotated feature columns in order: conditional promised reward, conditional threatened harm, forwarding obligation. Compatible classes are not established identities; unknown evidence retained. No automatic semantic parsing, diagnosis, authenticity or safety determination.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
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
