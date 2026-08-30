import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ScriptDeferAsyncExecutionOrderTableInput = {
  readonly kind: "classic" | "module";
  readonly external: boolean;
  readonly async: boolean;
  readonly defer: boolean;
};
export type ScriptDeferAsyncExecutionOrderTableOutput = {
  readonly phase: "during-parsing" | "after-parsing" | "when-ready";
  readonly parserBlocking: boolean;
  readonly orderedWithDeferred: boolean;
};
export const scriptDeferAsyncExecutionOrderTableInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "classic",
        "module"
      ],
      "description": "Kind"
    },
    "external": {
      "type": "boolean",
      "description": "External"
    },
    "async": {
      "type": "boolean",
      "description": "Async"
    },
    "defer": {
      "type": "boolean",
      "description": "Defer"
    }
  },
  "required": [
    "kind",
    "external",
    "async",
    "defer"
  ]
} as const satisfies ToolJsonSchema;
export const scriptDeferAsyncExecutionOrderTableOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "phase": {
      "type": "string",
      "enum": [
        "during-parsing",
        "after-parsing",
        "when-ready"
      ],
      "description": "Phase"
    },
    "parserBlocking": {
      "type": "boolean",
      "description": "Parser Blocking"
    },
    "orderedWithDeferred": {
      "type": "boolean",
      "description": "Ordered With Deferred"
    }
  },
  "required": [
    "phase",
    "parserBlocking",
    "orderedWithDeferred"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/scripting.html#the-script-element
export const calculateScriptDeferAsyncExecutionOrderTable = (rawInput: unknown): ToolResult<ScriptDeferAsyncExecutionOrderTableOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly kind?: unknown; readonly external?: unknown; readonly async?: unknown; readonly defer?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "kind",
  "external",
  "async",
  "defer"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const kindValue = candidate.kind;
if (typeof kindValue !== "string") return issue("kind", "invalid_type", "Enter a string value.");
if (kindValue !== "classic" && kindValue !== "module") return issue("kind", "invalid_value", "Choose a supported value.");
const externalValue = candidate.external;
if (typeof externalValue !== "boolean") return issue("external", "invalid_type", "Enter a boolean value.");
const asyncValue = candidate.async;
if (typeof asyncValue !== "boolean") return issue("async", "invalid_type", "Enter a boolean value.");
const deferValue = candidate.defer;
if (typeof deferValue !== "boolean") return issue("defer", "invalid_type", "Enter a boolean value.");
  const input: ScriptDeferAsyncExecutionOrderTableInput = { kind: kindValue, external: externalValue, async: asyncValue, defer: deferValue };
 const module = input.kind === "module";
 const async = input.async && (module || input.external);
 const deferred = !async && (module || input.external && input.defer);
 return toolSuccess({ phase: async ? "when-ready" : deferred ? "after-parsing" : "during-parsing", parserBlocking: !async && !deferred, orderedWithDeferred: deferred });
};
export const example = {
  "input": {
    "kind": "classic",
    "external": true,
    "async": false,
    "defer": true
  },
  "output": {
    "phase": "after-parsing",
    "parserBlocking": false,
    "orderedWithDeferred": true
  }
} satisfies ToolExample<ScriptDeferAsyncExecutionOrderTableInput, ScriptDeferAsyncExecutionOrderTableOutput>;
export const scriptDeferAsyncExecutionOrderTableTool = defineTool<ScriptDeferAsyncExecutionOrderTableInput, ScriptDeferAsyncExecutionOrderTableOutput>({
  id: "html/script-defer-async-execution-order-table",
  title: "script defer/async Execution Order Table",
  description: "Classifies execution scheduling of ordinary parser-inserted classic or module scripts. Async wins over defer; inline classic flags are ignored. This assumes scripting enabled and successful fetch/evaluation, without dynamic insertion or blocking attributes.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: scriptDeferAsyncExecutionOrderTableInputSchema,
  outputSchema: scriptDeferAsyncExecutionOrderTableOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "kind",
        "label": "Kind",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "external",
        "label": "External",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "async",
        "label": "Async",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "defer",
        "label": "Defer",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "phase",
        "label": "Phase",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "parserBlocking",
        "label": "Parser Blocking",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "orderedWithDeferred",
        "label": "Ordered With Deferred",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateScriptDeferAsyncExecutionOrderTable,
});
export const runScriptDeferAsyncExecutionOrderTable = scriptDeferAsyncExecutionOrderTableTool.execute;
export default scriptDeferAsyncExecutionOrderTableTool;
