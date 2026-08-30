import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly observedSystems: readonly string[];
  readonly observedSymptoms: readonly string[];
}>;
export type Output = Readonly<{
  readonly distinctSystems: readonly string[];
  readonly systemCount: number;
  readonly symptomCount: number;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.observedSystems, input.observedSymptoms, "observedSystems");
  if (
    new Set(input.observedSymptoms).size !== input.observedSymptoms.length ||
    input.observedSystems.some((v) => !v.trim()) ||
    input.observedSymptoms.some((v) => !v.trim())
  )
    simpleError(
      "observedSystems",
      "Nonempty system and symptom labels required.",
    );
  const distinctSystems = [...new Set(input.observedSystems)];
  return {
    distinctSystems,
    systemCount: distinctSystems.length,
    symptomCount: new Set(input.observedSymptoms).size,
  };
};
export const exampleInput = {
  observedSystems: ["cardiac", "skeletal", "cardiac"],
  observedSymptoms: ["a", "b", "c"],
} satisfies Input;
export const exampleOutput = {
  distinctSystems: ["cardiac", "skeletal"],
  systemCount: 2,
  symptomCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/multisystem-phenotype-tally",
  title: "Multisystem Phenotype Tally",
  description:
    "Summarize observed symptoms across body systems without inferring a genetic cause.",
  inputs: [
    { id: "observedSystems", label: "Observed systems", kind: "stringList" },
    { id: "observedSymptoms", label: "Observed symptoms", kind: "stringList" },
  ],
  outputs: [
    { id: "distinctSystems", label: "Distinct systems", kind: "stringList" },
    { id: "systemCount", label: "System count", kind: "number" },
    { id: "symptomCount", label: "Symptom count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedSystems: value.observedSystems as readonly string[],
      observedSymptoms: value.observedSymptoms as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
