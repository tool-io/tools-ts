import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InvocatioTrinitarianDetectorInput = {
  readonly text: string;
};

export type InvocatioTrinitarianDetectorOutput = {
  readonly isTrinitarian: boolean;
  readonly personGroupCount: number;
  readonly matchedTerms: readonly string[];
  readonly classification: "trinitarian" | "non_trinitarian";
};

const PERSON_GROUPS: ReadonlyArray<readonly [string, readonly string[]]> = [
  ["father", ["pater", "patris", "patrem", "father"]],
  ["son", ["filius", "filii", "filio"]],
  ["spirit", ["spiritus", "spiritum", "spiritu", "holy ghost", "holy spirit"]],
];

const TRINITY_TERMS: ReadonlyArray<string> = [
  "trinitas",
  "trinitate",
  "trinitatis",
  "trinity",
];

const normalize = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const calculateInvocatioTrinitarianDetector = (
  input: InvocatioTrinitarianDetectorInput,
): InvocatioTrinitarianDetectorOutput => {
  const normalized = normalize(input.text);
  if (normalized.trim().length === 0)
    return simpleError(
      "text",
      "Provide a non-empty invocatio transcription.",
      "invalid_text",
    );
  const matchedTerms: string[] = [];
  for (const [, terms] of PERSON_GROUPS)
    for (const term of terms)
      if (new RegExp(`\\b${term}\\b`).test(normalized)) matchedTerms.push(term);
  const personGroupCount = PERSON_GROUPS.filter(([, terms]) =>
    terms.some((term) => matchedTerms.includes(term)),
  ).length;
  const explicitTrinity = TRINITY_TERMS.some((term) =>
    new RegExp(`\\b${term}\\b`).test(normalized),
  );
  const isTrinitarian = explicitTrinity || personGroupCount === 3;
  return {
    classification: isTrinitarian ? "trinitarian" : "non_trinitarian",
    isTrinitarian,
    matchedTerms,
    personGroupCount,
  };
};

export const invocatioTrinitarianDetectorExample = {
  input: { text: "In nomine Patris et Filii et Spiritus Sancti." },
  output: {
    classification: "trinitarian",
    isTrinitarian: true,
    matchedTerms: ["patris", "filii", "spiritus"],
    personGroupCount: 3,
  },
} satisfies ToolExample<
  InvocatioTrinitarianDetectorInput,
  InvocatioTrinitarianDetectorOutput
>;

export const invocatioTrinitarianDetectorTool = createSimpleTool({
  id: "paleography/invocatio-trinitarian-detector",
  title: "Invocatio Trinitarian Detector",
  description:
    "Classify a charter invocatio as trinitarian under the stated heuristic: word-boundary matches for an explicit Trinity term or all three Father, Son and Holy-Spirit keyword groups mark it trinitarian.",
  inputs: [
    {
      description: "Invocatio transcription to scan.",
      id: "text",
      kind: "string",
      label: "Invocatio",
    },
  ],
  outputs: [
    {
      description: "True when the invocation invokes the Trinity.",
      id: "isTrinitarian",
      kind: "boolean",
      label: "Is trinitarian",
    },
    {
      description: "Number of divine-person keyword groups represented (0-3).",
      id: "personGroupCount",
      kind: "integer",
      label: "Person groups",
    },
    {
      description: "Keyword terms matched by the scan, in fixed order.",
      id: "matchedTerms",
      kind: "stringList",
      label: "Matched terms",
    },
    {
      description: "Stated-heuristic classification of the invocation.",
      id: "classification",
      enum: ["trinitarian", "non_trinitarian"],
      kind: "string",
      label: "Classification",
    },
  ],
  calculate: (input) =>
    calculateInvocatioTrinitarianDetector({ text: input.text as string }),
});

export const runInvocatioTrinitarianDetector =
  invocatioTrinitarianDetectorTool.execute;
export default invocatioTrinitarianDetectorTool;
