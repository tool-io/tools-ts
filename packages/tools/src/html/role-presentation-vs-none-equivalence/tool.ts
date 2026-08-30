import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type RolePresentationVsNoneEquivalenceInput = {
  readonly role: "presentation" | "none";
  readonly focusableOrInteractive: boolean;
  readonly hasGlobalAria: boolean;
};
export type RolePresentationVsNoneEquivalenceOutput = {
  readonly removesOwnImplicitSemantics: boolean;
  readonly ignoredByConflict: boolean;
};
export const rolePresentationVsNoneEquivalenceInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "role": {
      "type": "string",
      "enum": [
        "presentation",
        "none"
      ],
      "description": "Role"
    },
    "focusableOrInteractive": {
      "type": "boolean",
      "description": "Focusable Or Interactive"
    },
    "hasGlobalAria": {
      "type": "boolean",
      "description": "Has Global Aria"
    }
  },
  "required": [
    "role",
    "focusableOrInteractive",
    "hasGlobalAria"
  ]
} as const satisfies ToolJsonSchema;
export const rolePresentationVsNoneEquivalenceOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "removesOwnImplicitSemantics": {
      "type": "boolean",
      "description": "Removes Own Implicit Semantics"
    },
    "ignoredByConflict": {
      "type": "boolean",
      "description": "Ignored By Conflict"
    }
  },
  "required": [
    "removesOwnImplicitSemantics",
    "ignoredByConflict"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/wai-aria-1.2/#presentation; https://www.w3.org/TR/wai-aria-1.2/#conflict_resolution_presentation_none
export const calculateRolePresentationVsNoneEquivalence = (rawInput: unknown): ToolResult<RolePresentationVsNoneEquivalenceOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly role?: unknown; readonly focusableOrInteractive?: unknown; readonly hasGlobalAria?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "role",
  "focusableOrInteractive",
  "hasGlobalAria"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const roleValue = candidate.role;
if (typeof roleValue !== "string") return issue("role", "invalid_type", "Enter a string value.");
if (roleValue !== "presentation" && roleValue !== "none") return issue("role", "invalid_value", "Choose a supported value.");
const focusableOrInteractiveValue = candidate.focusableOrInteractive;
if (typeof focusableOrInteractiveValue !== "boolean") return issue("focusableOrInteractive", "invalid_type", "Enter a boolean value.");
const hasGlobalAriaValue = candidate.hasGlobalAria;
if (typeof hasGlobalAriaValue !== "boolean") return issue("hasGlobalAria", "invalid_type", "Enter a boolean value.");
  const input: RolePresentationVsNoneEquivalenceInput = { role: roleValue, focusableOrInteractive: focusableOrInteractiveValue, hasGlobalAria: hasGlobalAriaValue };
 const ignoredByConflict = input.focusableOrInteractive || input.hasGlobalAria;
 return toolSuccess({ removesOwnImplicitSemantics: !ignoredByConflict, ignoredByConflict });
};
export const example = {
  "input": {
    "role": "none",
    "focusableOrInteractive": false,
    "hasGlobalAria": false
  },
  "output": {
    "removesOwnImplicitSemantics": true,
    "ignoredByConflict": false
  }
} satisfies ToolExample<RolePresentationVsNoneEquivalenceInput, RolePresentationVsNoneEquivalenceOutput>;
export const rolePresentationVsNoneEquivalenceTool = defineTool<RolePresentationVsNoneEquivalenceInput, RolePresentationVsNoneEquivalenceOutput>({
  id: "html/role-presentation-vs-none-equivalence",
  title: "role=presentation vs none Equivalence",
  description: "Resolves equivalent presentation/none roles on an element, including focusable or otherwise interactive elements and global ARIA conflict resolution. Reports removal of this element's own implicit semantics; required owned descendants need separate checks.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: rolePresentationVsNoneEquivalenceInputSchema,
  outputSchema: rolePresentationVsNoneEquivalenceOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "role",
        "label": "Role",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "focusableOrInteractive",
        "label": "Focusable Or Interactive",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "hasGlobalAria",
        "label": "Has Global Aria",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "removesOwnImplicitSemantics",
        "label": "Removes Own Implicit Semantics",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "ignoredByConflict",
        "label": "Ignored By Conflict",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateRolePresentationVsNoneEquivalence,
});
export const runRolePresentationVsNoneEquivalence = rolePresentationVsNoneEquivalenceTool.execute;
export default rolePresentationVsNoneEquivalenceTool;
