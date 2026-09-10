import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerObservedMovementEpisodeIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerObservedMovementEpisodeIds",
    label: "Caller observed movement episode ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.callerObservedMovementEpisodeIds.some((v) => !v.trim()))
    simpleError("episodes", "Explicit independent episode IDs.");
  const ids = [...new Set(input.callerObservedMovementEpisodeIds)];
  return {
    distinctObservedMovementEpisodeCount: ids.length,
    distinctObservedMovementEpisodeIds: ids,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerObservedMovementEpisodeIds: ["a", "b", "a"] },
  output: {
    result: {
      distinctObservedMovementEpisodeCount: 2,
      distinctObservedMovementEpisodeIds: ["a", "b"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/fetal-movement-count",
  title: "Fetal Movement Count Tool",
  description:
    "Deduplicate actual independently recorded movement-episode IDs, not infer unobserved movement, normal fetal activity or reassure about viability.",
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
