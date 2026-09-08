import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, toothAudit } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyIdentifiedFdiTeeth: readonly string[];
  readonly independentlyCodedMutuallyExclusiveToothStatus: readonly number[];
  readonly toothEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyIdentifiedFdiTeeth",
    label: "Independently identified fdi teeth",
    kind: "stringList",
  },
  {
    id: "independentlyCodedMutuallyExclusiveToothStatus",
    label: "Independently coded mutually exclusive tooth status",
    kind: "numberList",
  },
  {
    id: "toothEvidenceKnownFlags",
    label: "Tooth evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return toothAudit(
    input.independentlyIdentifiedFdiTeeth,
    input.independentlyCodedMutuallyExclusiveToothStatus,
    input.toothEvidenceKnownFlags,
    true,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyIdentifiedFdiTeeth: ["51", "52", "53"],
    independentlyCodedMutuallyExclusiveToothStatus: [1, 2, 3],
    toothEvidenceKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      decayedCount: 1,
      missingOrExtractionCount: 1,
      filledCount: 1,
      knownIndexTotal: 3,
      unknownToothIds: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/def-index",
  title: "DEF Index Calculator",
  description:
    "Actual primary deft/def inventory, one independently classified status per actual FDI tooth:0sound,1decayed,2indicated/extracted due to caries under independently declared convention,3filled without current decay. Qualification, cause attribution and actual examined dentition external; unknowns not imputed; not double count teeth or infer disease risk.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
