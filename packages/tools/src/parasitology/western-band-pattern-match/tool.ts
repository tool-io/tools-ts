import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedBands: readonly string[];
  readonly requiredBands: readonly string[];
  readonly forbiddenBands: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingRequiredBands: readonly string[];
  readonly presentForbiddenBands: readonly string[];
  readonly patternMatches: boolean;
}>;
export const calculate = (input: Input): Output => {
  const forbidden = new Set(input.forbiddenBands);
  if (
    !input.requiredBands.length ||
    new Set(input.requiredBands).size !== input.requiredBands.length ||
    input.requiredBands.some((v) => forbidden.has(v))
  )
    simpleError(
      "requiredBands",
      "Distinct nonempty required bands without forbidden overlap required.",
    );
  const observed = new Set(input.observedBands),
    missingRequiredBands = input.requiredBands.filter((v) => !observed.has(v)),
    presentForbiddenBands = input.forbiddenBands.filter((v) => observed.has(v));
  return {
    missingRequiredBands,
    presentForbiddenBands,
    patternMatches:
      missingRequiredBands.length === 0 && presentForbiddenBands.length === 0,
  };
};
export const exampleInput = {
  observedBands: ["A", "C"],
  requiredBands: ["A", "B"],
  forbiddenBands: ["D"],
} satisfies Input;
export const exampleOutput = {
  missingRequiredBands: ["B"],
  presentForbiddenBands: [],
  patternMatches: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/western-band-pattern-match",
  title: "Western Band Pattern Match",
  description:
    "Compare western-blot band observations with caller-defined required and forbidden assay patterns.",
  inputs: [
    { id: "observedBands", label: "Observed bands", kind: "stringList" },
    { id: "requiredBands", label: "Required bands", kind: "stringList" },
    { id: "forbiddenBands", label: "Forbidden bands", kind: "stringList" },
  ],
  outputs: [
    {
      id: "missingRequiredBands",
      label: "Missing required bands",
      kind: "stringList",
    },
    {
      id: "presentForbiddenBands",
      label: "Present forbidden bands",
      kind: "stringList",
    },
    { id: "patternMatches", label: "Pattern matches", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      observedBands: value.observedBands as readonly string[],
      requiredBands: value.requiredBands as readonly string[],
      forbiddenBands: value.forbiddenBands as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
