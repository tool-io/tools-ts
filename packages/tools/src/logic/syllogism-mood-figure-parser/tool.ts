import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SyllogismMoodFigureParserInput = {
  readonly syllogism: string;
};
export type SyllogismMoodFigureParserOutput = {
  readonly majorKind: "A" | "E" | "I" | "O";
  readonly minorKind: "A" | "E" | "I" | "O";
  readonly conclusionKind: "A" | "E" | "I" | "O";
  readonly figure: number;
  readonly majorSubject: "S" | "M" | "P";
  readonly majorPredicate: "S" | "M" | "P";
  readonly minorSubject: "S" | "M" | "P";
  readonly minorPredicate: "S" | "M" | "P";
};
export const syllogismMoodFigureParserInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "syllogism": {
      "type": "string",
      "maxLength": 5,
      "pattern": "^[AEIO]{3}-[1-4]$(?![\\s\\S])",
      "description": "Mood and figure"
    }
  },
  "required": [
    "syllogism"
  ]
} as const satisfies ToolJsonSchema;
export const syllogismMoodFigureParserOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "majorKind": {
      "type": "string",
      "enum": [
        "A",
        "E",
        "I",
        "O"
      ],
      "description": "Major proposition kind"
    },
    "minorKind": {
      "type": "string",
      "enum": [
        "A",
        "E",
        "I",
        "O"
      ],
      "description": "Minor proposition kind"
    },
    "conclusionKind": {
      "type": "string",
      "enum": [
        "A",
        "E",
        "I",
        "O"
      ],
      "description": "Conclusion proposition kind"
    },
    "figure": {
      "type": "integer",
      "minimum": 1,
      "maximum": 4,
      "description": "Syllogism figure"
    },
    "majorSubject": {
      "type": "string",
      "enum": [
        "S",
        "M",
        "P"
      ],
      "description": "Major premise subject"
    },
    "majorPredicate": {
      "type": "string",
      "enum": [
        "S",
        "M",
        "P"
      ],
      "description": "Major premise predicate"
    },
    "minorSubject": {
      "type": "string",
      "enum": [
        "S",
        "M",
        "P"
      ],
      "description": "Minor premise subject"
    },
    "minorPredicate": {
      "type": "string",
      "enum": [
        "S",
        "M",
        "P"
      ],
      "description": "Minor premise predicate"
    }
  },
  "required": [
    "majorKind",
    "minorKind",
    "conclusionKind",
    "figure",
    "majorSubject",
    "majorPredicate",
    "minorSubject",
    "minorPredicate"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);
export type PropositionKind = "A" | "E" | "I" | "O";
export type CategoryTerm = "S" | "M" | "P";
export const figureTerms = (figure: number) => {
  if (figure === 1) return { majorSubject: "M", majorPredicate: "P", minorSubject: "S", minorPredicate: "M" } as const;
  if (figure === 2) return { majorSubject: "P", majorPredicate: "M", minorSubject: "S", minorPredicate: "M" } as const;
  if (figure === 3) return { majorSubject: "M", majorPredicate: "P", minorSubject: "M", minorPredicate: "S" } as const;
  return { majorSubject: "P", majorPredicate: "M", minorSubject: "M", minorPredicate: "S" } as const;
};
export const termDistributed = (kind: PropositionKind, position: "subject" | "predicate"): boolean =>
  position === "subject" ? kind === "A" || kind === "E" : kind === "E" || kind === "O";
const termBit = { S: 4, M: 2, P: 1 } as const;
export const categoryHolds = (occupied: number, kind: PropositionKind, subject: CategoryTerm, predicate: CategoryTerm): boolean => {
  let intersection = false, difference = false;
  for (let region = 0; region < 8; region++) {
    if ((occupied & (1 << region)) === 0 || (region & termBit[subject]) === 0) continue;
    if ((region & termBit[predicate]) !== 0) intersection = true;
    else difference = true;
  }
  if (kind === "A") return !difference;
  if (kind === "E") return !intersection;
  if (kind === "I") return intersection;
  return difference;
};
export const categoricalValidity = (major: PropositionKind, minor: PropositionKind, conclusion: PropositionKind, figure: number, nonemptyTerms: ReadonlyArray<CategoryTerm>): boolean => {
  const terms = figureTerms(figure);
  // One witness per occupied region suffices: A/E constrain emptiness, I/O require occupancy.
  for (let occupied = 1; occupied < 256; occupied++) {
    if (nonemptyTerms.some((term) => {
      for (let region = 0; region < 8; region++) if ((occupied & (1 << region)) !== 0 && (region & termBit[term]) !== 0) return false;
      return true;
    })) continue;
    if (categoryHolds(occupied, major, terms.majorSubject, terms.majorPredicate)
      && categoryHolds(occupied, minor, terms.minorSubject, terms.minorPredicate)
      && !categoryHolds(occupied, conclusion, "S", "P")) return false;
  }
  return true;
};
// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm; https://faculty.fiu.edu/~harrisk/Notes/Critical%20Thinking/Categorical%20Syllogisms,%20Venn%20Diagrams%20and%20Rules%20for%20Testing.htm
export const calculateSyllogismMoodFigureParser = (rawInput: unknown): ToolResult<SyllogismMoodFigureParserOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly syllogism?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "syllogism"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const syllogismValue = candidate.syllogism;
  if (typeof syllogismValue !== "string") return issue("syllogism", "invalid_type", "Enter a string value.");
  if (syllogismValue.length > 5) return issue("syllogism", "resource_limit", "Text exceeds the 5-character resource limit.");
  if (!(new RegExp("^[AEIO]{3}-[1-4]$(?![\\s\\S])")).test(syllogismValue)) return issue("syllogism", "invalid_format", "Text does not match the accepted syntax.");

  const input: SyllogismMoodFigureParserInput = { syllogism: syllogismValue };
  const decode = (character: string | undefined): PropositionKind => character === "A" ? "A" : character === "E" ? "E" : character === "I" ? "I" : "O";
  const figure = Number(input.syllogism[4]);
  return toolSuccess({ majorKind: decode(input.syllogism[0]), minorKind: decode(input.syllogism[1]), conclusionKind: decode(input.syllogism[2]), figure, ...figureTerms(figure) });
};
export const example = {
  input: {
    "syllogism": "AAA-1"
  },
  output: {
    "majorKind": "A",
    "minorKind": "A",
    "conclusionKind": "A",
    "figure": 1,
    "majorSubject": "M",
    "majorPredicate": "P",
    "minorSubject": "S",
    "minorPredicate": "M"
  },
} satisfies ToolExample<SyllogismMoodFigureParserInput, SyllogismMoodFigureParserOutput>;
export const syllogismMoodFigureParserTool = defineTool<SyllogismMoodFigureParserInput, SyllogismMoodFigureParserOutput>({
  id: "logic/syllogism-mood-figure-parser",
  title: "Categorical Syllogism Mood-Figure Label Parser (EAE-1 etc.)",
  description: "Parse a categorical mood and figure such as AAA-1 into proposition kinds and standard S, M, and P term positions.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: syllogismMoodFigureParserInputSchema,
  outputSchema: syllogismMoodFigureParserOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "syllogism",
        "label": "Mood and figure",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "majorKind",
        "label": "Major proposition kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "minorKind",
        "label": "Minor proposition kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionKind",
        "label": "Conclusion proposition kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "figure",
        "label": "Syllogism figure",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "majorSubject",
        "label": "Major premise subject",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "majorPredicate",
        "label": "Major premise predicate",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "minorSubject",
        "label": "Minor premise subject",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "minorPredicate",
        "label": "Minor premise predicate",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateSyllogismMoodFigureParser,
});
export const runSyllogismMoodFigureParser = syllogismMoodFigureParserTool.execute;
export default syllogismMoodFigureParserTool;
