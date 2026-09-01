import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, roman } from "../shared.js";
export type Input = Readonly<{
  readonly penultimateRomanChord: string;
  readonly finalRomanChord: string;
  readonly penultimateRootInBass: boolean;
  readonly finalTonicRootInBass: boolean;
  readonly finalSopranoOnTonic: boolean;
}>;
export type Output = Readonly<{
  readonly cadenceLabel: string;
  readonly recognizedFunctionalCadence: boolean;
}>;
const inputFields = [
  {
    id: "penultimateRomanChord",
    label: "Penultimate roman chord",
    kind: "string",
  },
  { id: "finalRomanChord", label: "Final roman chord", kind: "string" },
  {
    id: "penultimateRootInBass",
    label: "Penultimate root in bass",
    kind: "boolean",
  },
  {
    id: "finalTonicRootInBass",
    label: "Final tonic root in bass",
    kind: "boolean",
  },
  {
    id: "finalSopranoOnTonic",
    label: "Final soprano on tonic",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const a = roman(input.penultimateRomanChord),
    b = roman(input.finalRomanChord),
    plain = (x: ReturnType<typeof roman>, d: number) =>
      x.degree === d && x.alteration === 0;
  const authentic =
      plain(a, 5) &&
      a.quality === "major" &&
      plain(b, 1) &&
      ["major", "minor"].includes(b.quality) &&
      !b.seventh,
    plagal =
      plain(a, 4) &&
      ["major", "minor"].includes(a.quality) &&
      plain(b, 1) &&
      ["major", "minor"].includes(b.quality) &&
      !b.seventh,
    half = plain(b, 5) && b.quality === "major",
    deceptive =
      plain(a, 5) &&
      a.quality === "major" &&
      plain(b, 6) &&
      ["major", "minor"].includes(b.quality);
  const label = authentic
    ? input.penultimateRootInBass &&
      input.finalTonicRootInBass &&
      input.finalSopranoOnTonic
      ? "perfect-authentic"
      : "imperfect-authentic"
    : plagal
      ? "plagal"
      : half
        ? "half"
        : deceptive
          ? "deceptive"
          : "unrecognized";
  return {
    cadenceLabel: label,
    recognizedFunctionalCadence: label !== "unrecognized",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  penultimateRomanChord: "V7",
  finalRomanChord: "I",
  penultimateRootInBass: true,
  finalTonicRootInBass: true,
  finalSopranoOnTonic: true,
} satisfies Input;
export const exampleOutput = {
  cadenceLabel: "perfect-authentic",
  recognizedFunctionalCadence: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/cadence-type-classifier",
  title: "Cadence Type Classifier",
  description:
    "Classify supplied Roman-function pair with both root-bass and final soprano evidence under elementary authentic/plagal/half/deceptive conventions; authentic tonic must be a triad, no phrase-boundary inference or automatic audio analysis.",
  inputs: inputFields,
  outputs: [
    { id: "cadenceLabel", label: "Cadence label", kind: "string" },
    {
      id: "recognizedFunctionalCadence",
      label: "Recognized functional cadence",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      penultimateRomanChord: value.penultimateRomanChord as string,
      finalRomanChord: value.finalRomanChord as string,
      penultimateRootInBass: value.penultimateRootInBass as boolean,
      finalTonicRootInBass: value.finalTonicRootInBass as boolean,
      finalSopranoOnTonic: value.finalSopranoOnTonic as boolean,
    }),
});
export const run = tool.execute;
export default tool;
