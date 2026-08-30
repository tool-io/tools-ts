import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AriaLivePoliteAssertiveOffLookupInput = {
  readonly value: "off" | "polite" | "assertive";
};
export type AriaLivePoliteAssertiveOffLookupOutput = {
  readonly priority: "focus-dependent" | "polite" | "assertive";
  readonly mayInterrupt: boolean;
};
export const ariaLivePoliteAssertiveOffLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "value": {
      "type": "string",
      "enum": [
        "off",
        "polite",
        "assertive"
      ],
      "description": "Value"
    }
  },
  "required": [
    "value"
  ]
} as const satisfies ToolJsonSchema;
export const ariaLivePoliteAssertiveOffLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "priority": {
      "type": "string",
      "enum": [
        "focus-dependent",
        "polite",
        "assertive"
      ],
      "description": "Priority"
    },
    "mayInterrupt": {
      "type": "boolean",
      "description": "May Interrupt"
    }
  },
  "required": [
    "priority",
    "mayInterrupt"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/wai-aria-1.2/#aria-live
export const calculateAriaLivePoliteAssertiveOffLookup = (rawInput: unknown): ToolResult<AriaLivePoliteAssertiveOffLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly value?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "value"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valueValue = candidate.value;
if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
if (valueValue !== "off" && valueValue !== "polite" && valueValue !== "assertive") return issue("value", "invalid_value", "Choose a supported value.");
  const input: AriaLivePoliteAssertiveOffLookupInput = { value: valueValue };
 return toolSuccess({ priority: input.value === "off" ? "focus-dependent" : input.value, mayInterrupt: input.value === "assertive" });
};
export const example = {
  "input": {
    "value": "assertive"
  },
  "output": {
    "priority": "assertive",
    "mayInterrupt": true
  }
} satisfies ToolExample<AriaLivePoliteAssertiveOffLookupInput, AriaLivePoliteAssertiveOffLookupOutput>;
export const ariaLivePoliteAssertiveOffLookupTool = defineTool<AriaLivePoliteAssertiveOffLookupInput, AriaLivePoliteAssertiveOffLookupOutput>({
  id: "html/aria-live-polite-assertive-off-lookup",
  title: "aria-live polite/assertive/off Lookup",
  description: "Classifies aria-live priorities: polite waits for an appropriate idle opportunity, assertive may interrupt, and off permits updates associated with focus. Actual assistive-technology announcements are not guaranteed.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: ariaLivePoliteAssertiveOffLookupInputSchema,
  outputSchema: ariaLivePoliteAssertiveOffLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "value",
        "label": "Value",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "priority",
        "label": "Priority",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "mayInterrupt",
        "label": "May Interrupt",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateAriaLivePoliteAssertiveOffLookup,
});
export const runAriaLivePoliteAssertiveOffLookup = ariaLivePoliteAssertiveOffLookupTool.execute;
export default ariaLivePoliteAssertiveOffLookupTool;
