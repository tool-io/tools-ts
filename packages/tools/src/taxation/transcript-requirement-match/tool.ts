import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requiredTranscriptTypes: readonly string[];
  readonly availableTranscriptTypes: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchedTranscriptTypes: readonly string[];
  readonly missingTranscriptTypes: readonly string[];
  readonly coveragePercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.requiredTranscriptTypes.length === 0)
    simpleError(
      "requiredTranscriptTypes",
      "At least one required transcript type is needed.",
      "empty_requirements",
    );
  const available = new Set(
    input.availableTranscriptTypes
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  const required = [
    ...new Set(
      input.requiredTranscriptTypes
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
  if (required.length === 0)
    simpleError(
      "requiredTranscriptTypes",
      "Required transcript types cannot be blank.",
      "empty_requirements",
    );
  const matchedTranscriptTypes = required.filter((value) =>
      available.has(value),
    ),
    missingTranscriptTypes = required.filter((value) => !available.has(value));
  return {
    matchedTranscriptTypes,
    missingTranscriptTypes,
    coveragePercent: (matchedTranscriptTypes.length / required.length) * 100,
  };
};

export const exampleInput = {
  requiredTranscriptTypes: ["return", "account"],
  availableTranscriptTypes: ["account"],
} satisfies Input;
export const exampleOutput = {
  matchedTranscriptTypes: ["account"],
  missingTranscriptTypes: ["return"],
  coveragePercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      requiredTranscriptTypes:
        input.requiredTranscriptTypes as readonly string[],
      availableTranscriptTypes:
        input.availableTranscriptTypes as readonly string[],
    }),
  description: "Match required tax transcript types against available records.",
  id: "taxation/transcript-requirement-match",
  inputs: [
    {
      id: "requiredTranscriptTypes",
      label: "Required transcript types",
      kind: "stringList",
    },
    {
      id: "availableTranscriptTypes",
      label: "Available transcript types",
      kind: "stringList",
    },
  ],
  outputs: [
    {
      id: "matchedTranscriptTypes",
      label: "Matched transcript types",
      kind: "stringList",
    },
    {
      id: "missingTranscriptTypes",
      label: "Missing transcript types",
      kind: "stringList",
    },
    {
      id: "coveragePercent",
      label: "Requirement coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Transcript Requirement Match",
});

export const run = tool.execute;
export default tool;
