import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type GradientAngleCompassMapInput = {
  readonly direction: "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest";
};
export type GradientAngleCompassMapOutput = {
  readonly angle: number;
};
export const gradientAngleCompassMapInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "direction": {
      "type": "string",
      "enum": [
        "north",
        "northeast",
        "east",
        "southeast",
        "south",
        "southwest",
        "west",
        "northwest"
      ],
      "description": "Compass direction"
    }
  },
  "required": [
    "direction"
  ]
} as const satisfies ToolJsonSchema;
export const gradientAngleCompassMapOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "angle": {
      "type": "number",
      "minimum": 0,
      "maximum": 360,
      "description": "CSS gradient angle"
    }
  },
  "required": [
    "angle"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-images-3/
export const calculateGradientAngleCompassMap = (rawInput: unknown): ToolResult<GradientAngleCompassMapOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly direction?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "direction"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const directionValue = candidate.direction;
  if (typeof directionValue !== "string") return issue("direction", "invalid_type", "Enter a string value.");
  if (directionValue !== "north" && directionValue !== "northeast" && directionValue !== "east" && directionValue !== "southeast" && directionValue !== "south" && directionValue !== "southwest" && directionValue !== "west" && directionValue !== "northwest") return issue("direction", "invalid_value", "Choose a supported value.");

  const input: GradientAngleCompassMapInput = { direction: directionValue };
  const angles = { north: 0, northeast: 45, east: 90, southeast: 135, south: 180, southwest: 225, west: 270, northwest: 315 } as const;
  return toolSuccess({ angle: angles[input.direction] });
};
export const example = {
  input: {
    "direction": "east"
  },
  output: {
    "angle": 90
  },
} satisfies ToolExample<GradientAngleCompassMapInput, GradientAngleCompassMapOutput>;
export const gradientAngleCompassMapTool = defineTool<GradientAngleCompassMapInput, GradientAngleCompassMapOutput>({
  id: "css/gradient-angle-compass-map",
  title: "Gradient Angle Compass Direction Map",
  description: "Convert an exact compass direction to its CSS linear-gradient angle, measured clockwise from upward.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: gradientAngleCompassMapInputSchema,
  outputSchema: gradientAngleCompassMapOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "direction",
        "label": "Compass direction",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "angle",
        "label": "CSS gradient angle",
        "valueType": {
          "type": "number",
          "unit": "deg"
        }
      }
    ]
  },
  execute: calculateGradientAngleCompassMap,
});
export const runGradientAngleCompassMap = gradientAngleCompassMapTool.execute;
export default gradientAngleCompassMapTool;
