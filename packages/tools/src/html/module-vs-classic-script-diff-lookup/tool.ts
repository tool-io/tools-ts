import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ModuleVsClassicScriptDiffLookupInput = {
  readonly kind: "classic" | "module";
};
export type ModuleVsClassicScriptDiffLookupOutput = {
  readonly automaticStrictMode: boolean;
  readonly moduleScope: boolean;
  readonly topLevelVarUsesGlobalBinding: boolean;
};
export const moduleVsClassicScriptDiffLookupInputSchema = {
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
    }
  },
  "required": [
    "kind"
  ]
} as const satisfies ToolJsonSchema;
export const moduleVsClassicScriptDiffLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "automaticStrictMode": {
      "type": "boolean",
      "description": "Automatic Strict Mode"
    },
    "moduleScope": {
      "type": "boolean",
      "description": "Module Scope"
    },
    "topLevelVarUsesGlobalBinding": {
      "type": "boolean",
      "description": "Top Level Var Uses Global Binding"
    }
  },
  "required": [
    "automaticStrictMode",
    "moduleScope",
    "topLevelVarUsesGlobalBinding"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://tc39.es/ecma262/#sec-modules; https://html.spec.whatwg.org/multipage/scripting.html#module-script
export const calculateModuleVsClassicScriptDiffLookup = (rawInput: unknown): ToolResult<ModuleVsClassicScriptDiffLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly kind?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "kind"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const kindValue = candidate.kind;
if (typeof kindValue !== "string") return issue("kind", "invalid_type", "Enter a string value.");
if (kindValue !== "classic" && kindValue !== "module") return issue("kind", "invalid_value", "Choose a supported value.");
  const input: ModuleVsClassicScriptDiffLookupInput = { kind: kindValue };
 const module = input.kind === "module";
 return toolSuccess({ automaticStrictMode: module, moduleScope: module, topLevelVarUsesGlobalBinding: !module });
};
export const example = {
  "input": {
    "kind": "module"
  },
  "output": {
    "automaticStrictMode": true,
    "moduleScope": true,
    "topLevelVarUsesGlobalBinding": false
  }
} satisfies ToolExample<ModuleVsClassicScriptDiffLookupInput, ModuleVsClassicScriptDiffLookupOutput>;
export const moduleVsClassicScriptDiffLookupTool = defineTool<ModuleVsClassicScriptDiffLookupInput, ModuleVsClassicScriptDiffLookupOutput>({
  id: "html/module-vs-classic-script-diff-lookup",
  title: "Module vs Classic Script Diff Lookup",
  description: "Returns standard language facts for module or classic scripts: automatic strict mode, module scope and top-level var global binding. Classic scripts can opt into strict mode separately.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: moduleVsClassicScriptDiffLookupInputSchema,
  outputSchema: moduleVsClassicScriptDiffLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "kind",
        "label": "Kind",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "automaticStrictMode",
        "label": "Automatic Strict Mode",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "moduleScope",
        "label": "Module Scope",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "topLevelVarUsesGlobalBinding",
        "label": "Top Level Var Uses Global Binding",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateModuleVsClassicScriptDiffLookup,
});
export const runModuleVsClassicScriptDiffLookup = moduleVsClassicScriptDiffLookupTool.execute;
export default moduleVsClassicScriptDiffLookupTool;
