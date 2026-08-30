import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly plannedTopics: readonly string[];
  readonly taughtTopics: readonly string[];
  readonly observedUnplannedTopics: readonly string[];
}>;
export type Output = Readonly<{
  readonly explicitTopics: readonly string[];
  readonly implicitTopics: readonly string[];
  readonly nullTopics: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  const planned = new Set(input.plannedTopics),
    taught = new Set(input.taughtTopics);
  if (
    !planned.size ||
    planned.size !== input.plannedTopics.length ||
    input.observedUnplannedTopics.some((v) => planned.has(v))
  )
    simpleError(
      "plannedTopics",
      "Distinct planned topics and genuinely unplanned observations required.",
    );
  return {
    explicitTopics: input.plannedTopics.filter((v) => taught.has(v)),
    implicitTopics: [...new Set(input.observedUnplannedTopics)],
    nullTopics: input.plannedTopics.filter((v) => !taught.has(v)),
  };
};
export const exampleInput = {
  plannedTopics: ["algebra", "geometry"],
  taughtTopics: ["algebra"],
  observedUnplannedTopics: ["teamwork"],
} satisfies Input;
export const exampleOutput = {
  explicitTopics: ["algebra"],
  implicitTopics: ["teamwork"],
  nullTopics: ["geometry"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/curriculum-visibility-audit",
  title: "Curriculum Visibility Audit",
  description:
    "Distinguish explicitly taught, unplanned observed, and omitted planned topics.",
  inputs: [
    { id: "plannedTopics", label: "Planned topics", kind: "stringList" },
    { id: "taughtTopics", label: "Taught topics", kind: "stringList" },
    {
      id: "observedUnplannedTopics",
      label: "Observed unplanned topics",
      kind: "stringList",
    },
  ],
  outputs: [
    { id: "explicitTopics", label: "Explicit topics", kind: "stringList" },
    { id: "implicitTopics", label: "Implicit topics", kind: "stringList" },
    { id: "nullTopics", label: "Null topics", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      plannedTopics: value.plannedTopics as readonly string[],
      taughtTopics: value.taughtTopics as readonly string[],
      observedUnplannedTopics:
        value.observedUnplannedTopics as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
