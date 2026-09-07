import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyTranscribedSoundIds: readonly string[];
  readonly querySoundId: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyTranscribedSoundIds",
    label: "Independently transcribed sound ids",
    kind: "stringList",
  },
  { id: "querySoundId", label: "Query sound id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.independentlyTranscribedSoundIds.length ||
    !input.querySoundId.trim()
  )
    simpleError(
      "sounds",
      "Nonempty sound observations and exact caller phoneme/query ID.",
    );
  const known = input.independentlyTranscribedSoundIds.filter((v) => v !== "");
  if (!known.length)
    simpleError("sounds", "At least one independently known sound.");
  return {
    knownSoundCount: known.length,
    unknownSoundCount:
      input.independentlyTranscribedSoundIds.length - known.length,
    queryKnownSoundFraction:
      known.filter((v) => v === input.querySoundId).length / known.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyTranscribedSoundIds: ["s", "s", "t", ""],
    querySoundId: "s",
  },
  output: {
    result: {
      knownSoundCount: 3,
      unknownSoundCount: 1,
      queryKnownSoundFraction: 0.6666666666666666,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/consonance-ending-consonant-density-calculator",
  title: "Consonance Ending Consonant Density Calculator",
  description:
    "Density of exact independently transcribed endingConsonantIDs, not spelling-to-sound inference; empty entries retain unknown observations.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
