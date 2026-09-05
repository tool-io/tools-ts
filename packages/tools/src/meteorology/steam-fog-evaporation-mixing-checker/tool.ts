import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, evidenceClasses } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerSteamFogMixingClassIds: readonly string[];
  readonly callerSteamFogMixingRequiredEvidence: readonly (readonly number[])[];
  readonly observedSteamFogMixingEvidence: readonly number[];
  readonly knownSteamFogMixingEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly compatibleCallerClasses: readonly string[];
  readonly fullyWitnessedCallerClasses: readonly string[];
}>;
const inputFields = [
  {
    id: "callerSteamFogMixingClassIds",
    label: "Caller steam fog mixing class ids",
    kind: "stringList",
  },
  {
    id: "callerSteamFogMixingRequiredEvidence",
    label: "Caller steam fog mixing required evidence",
    kind: "matrix",
  },
  {
    id: "observedSteamFogMixingEvidence",
    label: "Observed steam fog mixing evidence",
    kind: "numberList",
  },
  {
    id: "knownSteamFogMixingEvidenceFlags",
    label: "Known steam fog mixing evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return evidenceClasses(
    input.callerSteamFogMixingClassIds,
    input.callerSteamFogMixingRequiredEvidence,
    input.observedSteamFogMixingEvidence,
    input.knownSteamFogMixingEvidenceFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSteamFogMixingClassIds: ["a", "b"],
  callerSteamFogMixingRequiredEvidence: [
    [1, 0],
    [0, 1],
  ],
  observedSteamFogMixingEvidence: [1, 0],
  knownSteamFogMixingEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  compatibleCallerClasses: ["a", "b"],
  fullyWitnessedCallerClasses: ["a"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/steam-fog-evaporation-mixing-checker",
  title: "Steam Fog Evaporation Mixing Checker",
  description:
    "Observed warm-water/cold-air moisture/mixing evidence, no saturation/visibility inferred from temperature alone. Independently declared positive evidence requirements; overlapping/unknown classes retained. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "compatibleCallerClasses",
      label: "Compatible caller classes",
      kind: "stringList",
    },
    {
      id: "fullyWitnessedCallerClasses",
      label: "Fully witnessed caller classes",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSteamFogMixingClassIds:
        value.callerSteamFogMixingClassIds as readonly string[],
      callerSteamFogMixingRequiredEvidence:
        value.callerSteamFogMixingRequiredEvidence as readonly (readonly number[])[],
      observedSteamFogMixingEvidence:
        value.observedSteamFogMixingEvidence as readonly number[],
      knownSteamFogMixingEvidenceFlags:
        value.knownSteamFogMixingEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
