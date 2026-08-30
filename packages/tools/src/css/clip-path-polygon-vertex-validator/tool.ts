import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ClipPathPolygonVertexValidatorInput = {
  readonly vertexCount: number;
};
export type ClipPathPolygonVertexValidatorOutput = {
  readonly validCount: boolean;
  readonly canEncloseArea: boolean;
  readonly minimumSyntaxVertices: number;
  readonly minimumAreaVertices: number;
};
export const clipPathPolygonVertexValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "vertexCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Vertex count"
    }
  },
  "required": [
    "vertexCount"
  ]
} as const satisfies ToolJsonSchema;
export const clipPathPolygonVertexValidatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "validCount": {
      "type": "boolean",
      "description": "Valid count"
    },
    "canEncloseArea": {
      "type": "boolean",
      "description": "Can enclose area"
    },
    "minimumSyntaxVertices": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Minimum syntax vertices"
    },
    "minimumAreaVertices": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Minimum area vertices"
    }
  },
  "required": [
    "validCount",
    "canEncloseArea",
    "minimumSyntaxVertices",
    "minimumAreaVertices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-shapes-1/#funcdef-polygon
export const calculateClipPathPolygonVertexValidator = (rawInput: unknown): ToolResult<ClipPathPolygonVertexValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly vertexCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "vertexCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const vertexCountValue = candidate.vertexCount;
  if (typeof vertexCountValue !== "number" || !Number.isSafeInteger(vertexCountValue)) return issue("vertexCount", "invalid_type", "Enter a finite safe integer.");
  if (vertexCountValue < 0) return issue("vertexCount", "out_of_range", "Value is outside the accepted range.");
  if (vertexCountValue > 9007199254740991) return issue("vertexCount", "out_of_range", "Value is outside the accepted range.");
  const input: ClipPathPolygonVertexValidatorInput = { vertexCount: vertexCountValue };
  return toolSuccess({ validCount: input.vertexCount >= 1, canEncloseArea: input.vertexCount >= 3, minimumSyntaxVertices: 1, minimumAreaVertices: 3 });
};
export const example = {
  input: {
    "vertexCount": 3
  },
  output: {
    "validCount": true,
    "canEncloseArea": true,
    "minimumSyntaxVertices": 1,
    "minimumAreaVertices": 3
  },
} satisfies ToolExample<ClipPathPolygonVertexValidatorInput, ClipPathPolygonVertexValidatorOutput>;
export const clipPathPolygonVertexValidatorTool = defineTool<ClipPathPolygonVertexValidatorInput, ClipPathPolygonVertexValidatorOutput>({
  id: "css/clip-path-polygon-vertex-validator",
  title: "clip-path polygon Vertex Count Validator",
  description: "Check polygon coordinate-pair count: CSS syntax requires at least one pair, while at least three vertices are necessary to enclose area; coordinates and degeneracy are not validated.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: clipPathPolygonVertexValidatorInputSchema,
  outputSchema: clipPathPolygonVertexValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "vertexCount",
        "label": "Vertex count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "validCount",
        "label": "Valid count",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "canEncloseArea",
        "label": "Can enclose area",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "minimumSyntaxVertices",
        "label": "Minimum syntax vertices",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "minimumAreaVertices",
        "label": "Minimum area vertices",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateClipPathPolygonVertexValidator,
});
export const runClipPathPolygonVertexValidator = clipPathPolygonVertexValidatorTool.execute;
export default clipPathPolygonVertexValidatorTool;
