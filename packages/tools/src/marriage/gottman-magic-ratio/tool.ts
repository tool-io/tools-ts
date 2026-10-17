import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPositiveConflictInteractionCount: number;
  readonly actualNegativeConflictInteractionCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualPositiveConflictInteractionCount",
    label: "Actual positive conflict interaction count",
    kind: "number",
  },
  {
    id: "actualNegativeConflictInteractionCount",
    label: "Actual negative conflict interaction count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  bounded(
    input.actualPositiveConflictInteractionCount,
    "positivecount",
    0,
    10000000,
  );
  bounded(
    input.actualNegativeConflictInteractionCount,
    "negativecount",
    0,
    10000000,
  );
  return {
    signedPositiveCountMinusNominalFiveToOneTarget:
      input.actualPositiveConflictInteractionCount -
      5 * input.actualNegativeConflictInteractionCount,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPositiveConflictInteractionCount: 10,
    actualNegativeConflictInteractionCount: 3,
  },
  output: { result: { signedPositiveCountMinusNominalFiveToOneTarget: -5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/gottman-magic-ratio",
  title: "Gottman Magic Ratio Calculator",
  description:
    "Actual qualified conflict-observation count difference to popularly cited5:1rule, not duplicate positive/negative ratio, validated universal cutoff or divorce likelihood. Nominal arithmetic distinct from scientific prediction.",
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
          signedPositiveCountMinusNominalFiveToOneTarget: { type: "number" },
        },
        required: ["signedPositiveCountMinusNominalFiveToOneTarget"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
