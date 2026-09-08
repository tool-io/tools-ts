import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly actualCollectedSalivaMl: number;
  readonly actualCollectionMinutes: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCollectedSalivaMl",
    label: "Actual collected saliva ml",
    kind: "number",
  },
  {
    id: "actualCollectionMinutes",
    label: "Actual collection minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualCollectedSalivaMl, "volume");
  positive(input.actualCollectionMinutes, "minutes");
  return {
    observedSalivaMlPerMinute:
      input.actualCollectedSalivaMl / input.actualCollectionMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCollectedSalivaMl: 2, actualCollectionMinutes: 5 },
  output: { result: { observedSalivaMlPerMinute: 0.4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/saliva-flow-rate-stimulated",
  title: "Stimulated Saliva Flow Rate Calculator",
  description:
    "Actual stimulated saliva volume/time with independently qualified collection protocol. State/stimulation methods matter; not universal hyposalivation threshold or diagnose xerostomia.",
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
