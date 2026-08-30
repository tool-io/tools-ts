import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type InertAttributeFocusSuppressionLookupInput = {
  readonly ownInert: boolean;
  readonly ancestorInert: boolean;
  readonly modalDialogEscapes: boolean;
};
export type InertAttributeFocusSuppressionLookupOutput = {
  readonly inert: boolean;
  readonly focusSuppressed: boolean;
  readonly interactionSuppressed: boolean;
};
export const inertAttributeFocusSuppressionLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "ownInert": {
      "type": "boolean",
      "description": "Own Inert"
    },
    "ancestorInert": {
      "type": "boolean",
      "description": "Ancestor Inert"
    },
    "modalDialogEscapes": {
      "type": "boolean",
      "description": "Modal Dialog Escapes"
    }
  },
  "required": [
    "ownInert",
    "ancestorInert",
    "modalDialogEscapes"
  ]
} as const satisfies ToolJsonSchema;
export const inertAttributeFocusSuppressionLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "inert": {
      "type": "boolean",
      "description": "Inert"
    },
    "focusSuppressed": {
      "type": "boolean",
      "description": "Focus Suppressed"
    },
    "interactionSuppressed": {
      "type": "boolean",
      "description": "Interaction Suppressed"
    }
  },
  "required": [
    "inert",
    "focusSuppressed",
    "interactionSuppressed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/interaction.html#the-inert-attribute
export const calculateInertAttributeFocusSuppressionLookup = (rawInput: unknown): ToolResult<InertAttributeFocusSuppressionLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly ownInert?: unknown; readonly ancestorInert?: unknown; readonly modalDialogEscapes?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "ownInert",
  "ancestorInert",
  "modalDialogEscapes"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const ownInertValue = candidate.ownInert;
if (typeof ownInertValue !== "boolean") return issue("ownInert", "invalid_type", "Enter a boolean value.");
const ancestorInertValue = candidate.ancestorInert;
if (typeof ancestorInertValue !== "boolean") return issue("ancestorInert", "invalid_type", "Enter a boolean value.");
const modalDialogEscapesValue = candidate.modalDialogEscapes;
if (typeof modalDialogEscapesValue !== "boolean") return issue("modalDialogEscapes", "invalid_type", "Enter a boolean value.");
  const input: InertAttributeFocusSuppressionLookupInput = { ownInert: ownInertValue, ancestorInert: ancestorInertValue, modalDialogEscapes: modalDialogEscapesValue };
 const inert = input.ownInert || input.ancestorInert && !input.modalDialogEscapes;
 return toolSuccess({ inert, focusSuppressed: inert, interactionSuppressed: inert });
};
export const example = {
  "input": {
    "ownInert": false,
    "ancestorInert": true,
    "modalDialogEscapes": false
  },
  "output": {
    "inert": true,
    "focusSuppressed": true,
    "interactionSuppressed": true
  }
} satisfies ToolExample<InertAttributeFocusSuppressionLookupInput, InertAttributeFocusSuppressionLookupOutput>;
export const inertAttributeFocusSuppressionLookupTool = defineTool<InertAttributeFocusSuppressionLookupInput, InertAttributeFocusSuppressionLookupOutput>({
  id: "html/inert-attribute-focus-suppression-lookup",
  title: "inert Focus Suppression Lookup",
  description: "Resolves inert attribute restrictions from own and inherited flat-tree inertness. A modal dialog opened with showModal escapes inherited inertness, while its own inert attribute still applies. Other disabling and focus rules are separate.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: inertAttributeFocusSuppressionLookupInputSchema,
  outputSchema: inertAttributeFocusSuppressionLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "ownInert",
        "label": "Own Inert",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "ancestorInert",
        "label": "Ancestor Inert",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "modalDialogEscapes",
        "label": "Modal Dialog Escapes",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "inert",
        "label": "Inert",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "focusSuppressed",
        "label": "Focus Suppressed",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "interactionSuppressed",
        "label": "Interaction Suppressed",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateInertAttributeFocusSuppressionLookup,
});
export const runInertAttributeFocusSuppressionLookup = inertAttributeFocusSuppressionLookupTool.execute;
export default inertAttributeFocusSuppressionLookupTool;
