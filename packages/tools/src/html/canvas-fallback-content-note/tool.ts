import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type CanvasFallbackContentNoteInput = {
  readonly canvasSupported: boolean;
  readonly scriptingEnabled: boolean;
};
export type CanvasFallbackContentNoteOutput = {
  readonly visualFallback: boolean;
  readonly scriptsCanDraw: boolean;
};
export const canvasFallbackContentNoteInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "canvasSupported": {
      "type": "boolean",
      "description": "Canvas Supported"
    },
    "scriptingEnabled": {
      "type": "boolean",
      "description": "Scripting Enabled"
    }
  },
  "required": [
    "canvasSupported",
    "scriptingEnabled"
  ]
} as const satisfies ToolJsonSchema;
export const canvasFallbackContentNoteOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "visualFallback": {
      "type": "boolean",
      "description": "Visual Fallback"
    },
    "scriptsCanDraw": {
      "type": "boolean",
      "description": "Scripts Can Draw"
    }
  },
  "required": [
    "visualFallback",
    "scriptsCanDraw"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element
export const calculateCanvasFallbackContentNote = (rawInput: unknown): ToolResult<CanvasFallbackContentNoteOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly canvasSupported?: unknown; readonly scriptingEnabled?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "canvasSupported",
  "scriptingEnabled"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const canvasSupportedValue = candidate.canvasSupported;
if (typeof canvasSupportedValue !== "boolean") return issue("canvasSupported", "invalid_type", "Enter a boolean value.");
const scriptingEnabledValue = candidate.scriptingEnabled;
if (typeof scriptingEnabledValue !== "boolean") return issue("scriptingEnabled", "invalid_type", "Enter a boolean value.");
  const input: CanvasFallbackContentNoteInput = { canvasSupported: canvasSupportedValue, scriptingEnabled: scriptingEnabledValue };
 return toolSuccess({ visualFallback: !input.canvasSupported || !input.scriptingEnabled, scriptsCanDraw: input.canvasSupported && input.scriptingEnabled });
};
export const example = {
  "input": {
    "canvasSupported": true,
    "scriptingEnabled": false
  },
  "output": {
    "visualFallback": true,
    "scriptsCanDraw": false
  }
} satisfies ToolExample<CanvasFallbackContentNoteInput, CanvasFallbackContentNoteOutput>;
export const canvasFallbackContentNoteTool = defineTool<CanvasFallbackContentNoteInput, CanvasFallbackContentNoteOutput>({
  id: "html/canvas-fallback-content-note",
  title: "Canvas Fallback Content Note",
  description: "Determines canvas fallback in interactive visual media from caller-supplied canvas support and scripting state. Disabled scripting or disabled canvas support displays fallback. Printing/static media and accessibility subtree behavior are outside this profile.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: canvasFallbackContentNoteInputSchema,
  outputSchema: canvasFallbackContentNoteOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "canvasSupported",
        "label": "Canvas Supported",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "scriptingEnabled",
        "label": "Scripting Enabled",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "visualFallback",
        "label": "Visual Fallback",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "scriptsCanDraw",
        "label": "Scripts Can Draw",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateCanvasFallbackContentNote,
});
export const runCanvasFallbackContentNote = canvasFallbackContentNoteTool.execute;
export default canvasFallbackContentNoteTool;
