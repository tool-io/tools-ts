import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AriaRoleValidNamesLookupInput = {
  readonly roles: ReadonlyArray<string>;
};
export type AriaRoleValidNamesLookupOutput = {
  readonly valid: ReadonlyArray<boolean>;
  readonly abstract: ReadonlyArray<boolean>;
};
export const ariaRoleValidNamesLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Roles"
    }
  },
  "required": [
    "roles"
  ]
} as const satisfies ToolJsonSchema;
export const ariaRoleValidNamesLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "valid": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Valid"
    },
    "abstract": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Abstract"
    }
  },
  "required": [
    "valid",
    "abstract"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/wai-aria-1.2/#role_definitions; https://www.w3.org/TR/html-aria/#case-requirements-for-aria-role-state-and-property-attributes
export const calculateAriaRoleValidNamesLookup = (rawInput: unknown): ToolResult<AriaRoleValidNamesLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly roles?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "roles"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const rolesValue = candidate.roles;
if (!Array.isArray(rolesValue)) return issue("roles", "invalid_type", "Enter a dense array.");
if (rolesValue.length < 0) return issue("roles", "out_of_range", "Too few entries.");
if (rolesValue.length > 10000) return issue("roles", "resource_limit", "Array exceeds the 10000-entry resource limit.");
const validatedRoles: string[] = [];
for (let index = 0; index < rolesValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(rolesValue, index)) return issue(`roles.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = rolesValue[index];
if (typeof item !== "string") return issue(`roles.${index}`, "invalid_type", "Enter a string value.");
if (item.length > 10000) return issue(`roles.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
validatedRoles.push(item);
}
if (validatedRoles.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("roles", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: AriaRoleValidNamesLookupInput = { roles: validatedRoles };
 const concrete = new Set([
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "insertion",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "subscript",
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem"
]);
 const abstractRoles = new Set([
  "command",
  "composite",
  "input",
  "landmark",
  "range",
  "roletype",
  "section",
  "sectionhead",
  "select",
  "structure",
  "widget",
  "window"
]);
 return toolSuccess({ valid: input.roles.map(role => concrete.has(role)), abstract: input.roles.map(role => abstractRoles.has(role)) });
};
export const example = {
  "input": {
    "roles": [
      "button",
      "widget",
      "BUTTON",
      "none"
    ]
  },
  "output": {
    "valid": [
      true,
      false,
      false,
      true
    ],
    "abstract": [
      false,
      true,
      false,
      false
    ]
  }
} satisfies ToolExample<AriaRoleValidNamesLookupInput, AriaRoleValidNamesLookupOutput>;
export const ariaRoleValidNamesLookupTool = defineTool<AriaRoleValidNamesLookupInput, AriaRoleValidNamesLookupOutput>({
  id: "html/aria-role-valid-names-lookup",
  title: "Valid ARIA Role Names Lookup",
  description: "Classifies individual WAI-ARIA 1.2 role names in their recommended lowercase author spelling as concrete, abstract or unknown. This exact-spelling vocabulary lookup excludes extensions and browser case-insensitive processing.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: ariaRoleValidNamesLookupInputSchema,
  outputSchema: ariaRoleValidNamesLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "roles",
        "label": "Roles",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      },
      {
        "id": "abstract",
        "label": "Abstract",
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ]
  },
  execute: calculateAriaRoleValidNamesLookup,
});
export const runAriaRoleValidNamesLookup = ariaRoleValidNamesLookupTool.execute;
export default ariaRoleValidNamesLookupTool;
