import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  mean,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRallyShotCounts: readonly number[];
  readonly rallyObservationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownMeanRallyShots: number;
  readonly knownRallyCount: number;
  readonly unknownRallyCount: number;
}>;
const inputFields = [
  {
    id: "observedRallyShotCounts",
    label: "Observed rally shot counts",
    kind: "numberList",
  },
  {
    id: "rallyObservationFlags",
    label: "Rally observation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedRallyShotCounts,
    input.rallyObservationFlags,
    "rallies",
  );
  binary(input.rallyObservationFlags, "evidence");
  input.observedRallyShotCounts.forEach((v) => bounded(v, "shots", 0, 1000));
  const known = input.observedRallyShotCounts.filter(
    (_, i) => input.rallyObservationFlags[i],
  );
  return {
    knownMeanRallyShots: mean(known),
    knownRallyCount: known.length,
    unknownRallyCount: input.rallyObservationFlags.length - known.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRallyShotCounts: [2, 5, 8],
  rallyObservationFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  knownMeanRallyShots: 5,
  knownRallyCount: 2,
  unknownRallyCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/padel-point-rally-length-average",
  title: "Padel Average Rally Length Calculator",
  description:
    "Pool actual padel rally annotations over known evidence only, not unknown-as-zero points or assumed rally difficulty.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownMeanRallyShots",
      label: "Known mean rally shots",
      kind: "number",
    },
    { id: "knownRallyCount", label: "Known rally count", kind: "number" },
    { id: "unknownRallyCount", label: "Unknown rally count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedRallyShotCounts:
        value.observedRallyShotCounts as readonly number[],
      rallyObservationFlags: value.rallyObservationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
