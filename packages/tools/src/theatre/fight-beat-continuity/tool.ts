import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly scriptBeatIds: readonly string[];
  readonly rehearsedBeatIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly missingRehearsedBeats: readonly string[];
  readonly unexpectedRehearsedBeats: readonly string[];
  readonly duplicateScriptBeats: readonly string[];
  readonly continuous: boolean;
}>;

export const calculate = (input: Input): Output => {
  const normalize = (values: readonly string[]) =>
      values.map((value) => value.trim().toLowerCase()).filter(Boolean),
    script = normalize(input.scriptBeatIds),
    rehearsed = normalize(input.rehearsedBeatIds),
    scriptSet = new Set(script),
    rehearsedSet = new Set(rehearsed);
  const duplicateScriptBeats = [
      ...new Set(
        script.filter((value, index) => script.indexOf(value) !== index),
      ),
    ],
    missingRehearsedBeats = [...scriptSet].filter(
      (value) => !rehearsedSet.has(value),
    ),
    unexpectedRehearsedBeats = [...rehearsedSet].filter(
      (value) => !scriptSet.has(value),
    );
  return {
    missingRehearsedBeats,
    unexpectedRehearsedBeats,
    duplicateScriptBeats,
    continuous:
      missingRehearsedBeats.length === 0 &&
      unexpectedRehearsedBeats.length === 0 &&
      duplicateScriptBeats.length === 0,
  };
};

export const exampleInput = {
  scriptBeatIds: ["a", "b", "c"],
  rehearsedBeatIds: ["a", "c", "b"],
} satisfies Input;
export const exampleOutput = {
  missingRehearsedBeats: [],
  unexpectedRehearsedBeats: [],
  duplicateScriptBeats: [],
  continuous: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      scriptBeatIds: input.scriptBeatIds as readonly string[],
      rehearsedBeatIds: input.rehearsedBeatIds as readonly string[],
    }),
  description: "Reconcile scripted and rehearsed fight-beat identifiers.",
  id: "theatre/fight-beat-continuity",
  inputs: [
    { id: "scriptBeatIds", label: "Script fight-beat IDs", kind: "stringList" },
    {
      id: "rehearsedBeatIds",
      label: "Rehearsed fight-beat IDs",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "missingRehearsedBeats",
      label: "Script beats not rehearsed",
      kind: "stringList",
    },
    {
      id: "unexpectedRehearsedBeats",
      label: "Rehearsed beats not scripted",
      kind: "stringList",
    },
    {
      id: "duplicateScriptBeats",
      label: "Duplicate script beat IDs",
      kind: "stringList",
    },
    { id: "continuous", label: "Beat sequence reconciles", kind: "boolean" },
  ],
  title: "Fight-Beat Continuity",
});

export const run = tool.execute;
export default tool;
