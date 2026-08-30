import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DialogOpenBackdropLookupInput = {
  readonly state: "closed" | "nonmodal" | "modal";
};
export type DialogOpenBackdropLookupOutput = {
  readonly open: boolean;
  readonly modal: boolean;
  readonly backdropEligible: boolean;
  readonly blocksDocument: boolean;
};
export const dialogOpenBackdropLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "state": {
      "type": "string",
      "enum": [
        "closed",
        "nonmodal",
        "modal"
      ],
      "description": "State"
    }
  },
  "required": [
    "state"
  ]
} as const satisfies ToolJsonSchema;
export const dialogOpenBackdropLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "open": {
      "type": "boolean",
      "description": "Open"
    },
    "modal": {
      "type": "boolean",
      "description": "Modal"
    },
    "backdropEligible": {
      "type": "boolean",
      "description": "Backdrop Eligible"
    },
    "blocksDocument": {
      "type": "boolean",
      "description": "Blocks Document"
    }
  },
  "required": [
    "open",
    "modal",
    "backdropEligible",
    "blocksDocument"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element
export const calculateDialogOpenBackdropLookup = (rawInput: unknown): ToolResult<DialogOpenBackdropLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly state?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "state"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const stateValue = candidate.state;
if (typeof stateValue !== "string") return issue("state", "invalid_type", "Enter a string value.");
if (stateValue !== "closed" && stateValue !== "nonmodal" && stateValue !== "modal") return issue("state", "invalid_value", "Choose a supported value.");
  const input: DialogOpenBackdropLookupInput = { state: stateValue };
 const modal = input.state === "modal";
 return toolSuccess({ open: input.state !== "closed", modal, backdropEligible: modal, blocksDocument: modal });
};
export const example = {
  "input": {
    "state": "modal"
  },
  "output": {
    "open": true,
    "modal": true,
    "backdropEligible": true,
    "blocksDocument": true
  }
} satisfies ToolExample<DialogOpenBackdropLookupInput, DialogOpenBackdropLookupOutput>;
export const dialogOpenBackdropLookupTool = defineTool<DialogOpenBackdropLookupInput, DialogOpenBackdropLookupOutput>({
  id: "html/dialog-open-backdrop-lookup",
  title: "dialog::backdrop Open Method Lookup",
  description: "Classifies closed, show/open nonmodal and showModal modal dialog states. Only modal dialogs enter the top layer and have a backdrop; actual appearance depends on CSS.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dialogOpenBackdropLookupInputSchema,
  outputSchema: dialogOpenBackdropLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "state",
        "label": "State",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "open",
        "label": "Open",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "modal",
        "label": "Modal",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "backdropEligible",
        "label": "Backdrop Eligible",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "blocksDocument",
        "label": "Blocks Document",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateDialogOpenBackdropLookup,
});
export const runDialogOpenBackdropLookup = dialogOpenBackdropLookupTool.execute;
export default dialogOpenBackdropLookupTool;
