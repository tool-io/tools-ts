import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CustomElementDashNameRequirementInput = {
  readonly name: string;
};
export type CustomElementDashNameRequirementOutput = {
  readonly valid: boolean;
  readonly containsDash: boolean;
  readonly reserved: boolean;
};
export const customElementDashNameRequirementInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "name": {
      "type": "string",
      "maxLength": 1000,
      "description": "Name"
    }
  },
  "required": [
    "name"
  ]
} as const satisfies ToolJsonSchema;
export const customElementDashNameRequirementOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "valid": {
      "type": "boolean",
      "description": "Valid"
    },
    "containsDash": {
      "type": "boolean",
      "description": "Contains Dash"
    },
    "reserved": {
      "type": "boolean",
      "description": "Reserved"
    }
  },
  "required": [
    "valid",
    "containsDash",
    "reserved"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name; https://dom.spec.whatwg.org/#valid-element-local-name
export const calculateCustomElementDashNameRequirement = (rawInput: unknown): ToolResult<CustomElementDashNameRequirementOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly name?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "name"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nameValue = candidate.name;
if (typeof nameValue !== "string") return issue("name", "invalid_type", "Enter a string value.");
if (nameValue.length > 1000) return issue("name", "resource_limit", "Text exceeds the 1000-character resource limit.");
  const input: CustomElementDashNameRequirementInput = { name: nameValue };
 const reserved = ["annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"].includes(input.name);
 const containsDash = input.name.includes("-");
 const valid = /^[a-z]/.test(input.name) && containsDash && !/[A-Z\u0000\t\n\f\r \/>]/u.test(input.name) && !reserved;
 return toolSuccess({ valid, containsDash, reserved });
};
export const example = {
  "input": {
    "name": "weather-panel"
  },
  "output": {
    "valid": true,
    "containsDash": true,
    "reserved": false
  }
} satisfies ToolExample<CustomElementDashNameRequirementInput, CustomElementDashNameRequirementOutput>;
export const customElementDashNameRequirementTool = defineTool<CustomElementDashNameRequirementInput, CustomElementDashNameRequirementOutput>({
  id: "html/custom-element-dash-name-requirement",
  title: "Custom Element Dash-Name Requirement",
  description: "Validates custom-element names using the current HTML and DOM local-name rules: initial ASCII lowercase, a dash, no ASCII uppercase or forbidden local-name characters, and no reserved SVG/MathML names. This does not check registry availability.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: customElementDashNameRequirementInputSchema,
  outputSchema: customElementDashNameRequirementOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "name",
        "label": "Name",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "valid",
        "label": "Valid",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "containsDash",
        "label": "Contains Dash",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "reserved",
        "label": "Reserved",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateCustomElementDashNameRequirement,
});
export const runCustomElementDashNameRequirement = customElementDashNameRequirementTool.execute;
export default customElementDashNameRequirementTool;
