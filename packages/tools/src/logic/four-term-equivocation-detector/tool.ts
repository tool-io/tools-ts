import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FourTermEquivocationDetectorInput = {
  readonly majorSubject: string;
  readonly majorPredicate: string;
  readonly minorSubject: string;
  readonly minorPredicate: string;
  readonly conclusionSubject: string;
  readonly conclusionPredicate: string;
};
export type FourTermEquivocationDetectorOutput = {
  readonly distinctTermCount: number;
  readonly fourTerms: boolean;
};
export const fourTermEquivocationDetectorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "majorSubject": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Major Subject"
    },
    "majorPredicate": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Major Predicate"
    },
    "minorSubject": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Minor Subject"
    },
    "minorPredicate": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Minor Predicate"
    },
    "conclusionSubject": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion Subject"
    },
    "conclusionPredicate": {
      "type": "string",
      "maxLength": 100,
      "pattern": "^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])",
      "description": "Conclusion Predicate"
    }
  },
  "required": [
    "majorSubject",
    "majorPredicate",
    "minorSubject",
    "minorPredicate",
    "conclusionSubject",
    "conclusionPredicate"
  ]
} as const satisfies ToolJsonSchema;
export const fourTermEquivocationDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "distinctTermCount": {
      "type": "integer",
      "minimum": 1,
      "maximum": 6,
      "description": "Distinct term count"
    },
    "fourTerms": {
      "type": "boolean",
      "description": "Exactly four distinct terms"
    }
  },
  "required": [
    "distinctTermCount",
    "fourTerms"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.stat.berkeley.edu/~stark/SticiGui/Text/categoricalLogic.htm; https://faculty.fiu.edu/~harrisk/Notes/Critical%20Thinking/Categorical%20Syllogisms,%20Venn%20Diagrams%20and%20Rules%20for%20Testing.htm
export const calculateFourTermEquivocationDetector = (rawInput: unknown): ToolResult<FourTermEquivocationDetectorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly majorSubject?: unknown; readonly majorPredicate?: unknown; readonly minorSubject?: unknown; readonly minorPredicate?: unknown; readonly conclusionSubject?: unknown; readonly conclusionPredicate?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "majorSubject",
  "majorPredicate",
  "minorSubject",
  "minorPredicate",
  "conclusionSubject",
  "conclusionPredicate"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const majorSubjectValue = candidate.majorSubject;
  if (typeof majorSubjectValue !== "string") return issue("majorSubject", "invalid_type", "Enter a string value.");
  if (majorSubjectValue.length > 100) return issue("majorSubject", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(majorSubjectValue)) return issue("majorSubject", "invalid_format", "Text does not match the accepted syntax.");
  const majorPredicateValue = candidate.majorPredicate;
  if (typeof majorPredicateValue !== "string") return issue("majorPredicate", "invalid_type", "Enter a string value.");
  if (majorPredicateValue.length > 100) return issue("majorPredicate", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(majorPredicateValue)) return issue("majorPredicate", "invalid_format", "Text does not match the accepted syntax.");
  const minorSubjectValue = candidate.minorSubject;
  if (typeof minorSubjectValue !== "string") return issue("minorSubject", "invalid_type", "Enter a string value.");
  if (minorSubjectValue.length > 100) return issue("minorSubject", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(minorSubjectValue)) return issue("minorSubject", "invalid_format", "Text does not match the accepted syntax.");
  const minorPredicateValue = candidate.minorPredicate;
  if (typeof minorPredicateValue !== "string") return issue("minorPredicate", "invalid_type", "Enter a string value.");
  if (minorPredicateValue.length > 100) return issue("minorPredicate", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(minorPredicateValue)) return issue("minorPredicate", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionSubjectValue = candidate.conclusionSubject;
  if (typeof conclusionSubjectValue !== "string") return issue("conclusionSubject", "invalid_type", "Enter a string value.");
  if (conclusionSubjectValue.length > 100) return issue("conclusionSubject", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionSubjectValue)) return issue("conclusionSubject", "invalid_format", "Text does not match the accepted syntax.");
  const conclusionPredicateValue = candidate.conclusionPredicate;
  if (typeof conclusionPredicateValue !== "string") return issue("conclusionPredicate", "invalid_type", "Enter a string value.");
  if (conclusionPredicateValue.length > 100) return issue("conclusionPredicate", "resource_limit", "Text exceeds the 100-character resource limit.");
  if (!(new RegExp("^(?!(?:true|false)$)[A-Za-z_][A-Za-z0-9_]*$(?![\\s\\S])")).test(conclusionPredicateValue)) return issue("conclusionPredicate", "invalid_format", "Text does not match the accepted syntax.");

  const input: FourTermEquivocationDetectorInput = { majorSubject: majorSubjectValue, majorPredicate: majorPredicateValue, minorSubject: minorSubjectValue, minorPredicate: minorPredicateValue, conclusionSubject: conclusionSubjectValue, conclusionPredicate: conclusionPredicateValue };
  const distinctTermCount = new Set([input.majorSubject, input.majorPredicate, input.minorSubject, input.minorPredicate, input.conclusionSubject, input.conclusionPredicate]).size;
  return toolSuccess({ distinctTermCount, fourTerms: distinctTermCount === 4 });
};
export const example = {
  input: {
    "majorSubject": "M1",
    "majorPredicate": "P",
    "minorSubject": "S",
    "minorPredicate": "M2",
    "conclusionSubject": "S",
    "conclusionPredicate": "P"
  },
  output: {
    "distinctTermCount": 4,
    "fourTerms": true
  },
} satisfies ToolExample<FourTermEquivocationDetectorInput, FourTermEquivocationDetectorOutput>;
export const fourTermEquivocationDetectorTool = defineTool<FourTermEquivocationDetectorInput, FourTermEquivocationDetectorOutput>({
  id: "logic/four-term-equivocation-detector",
  title: "Four-Term Fallacy Equivocation Detector",
  description: "Count distinct sense-specific term identifiers in a three-statement argument and flag exactly four terms.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fourTermEquivocationDetectorInputSchema,
  outputSchema: fourTermEquivocationDetectorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "majorSubject",
        "label": "Major Subject",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "majorPredicate",
        "label": "Major Predicate",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "minorSubject",
        "label": "Minor Subject",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "minorPredicate",
        "label": "Minor Predicate",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionSubject",
        "label": "Conclusion Subject",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "conclusionPredicate",
        "label": "Conclusion Predicate",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "distinctTermCount",
        "label": "Distinct term count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "fourTerms",
        "label": "Exactly four distinct terms",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateFourTermEquivocationDetector,
});
export const runFourTermEquivocationDetector = fourTermEquivocationDetectorTool.execute;
export default fourTermEquivocationDetectorTool;
