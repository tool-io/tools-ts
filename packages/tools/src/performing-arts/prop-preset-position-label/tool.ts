import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly propId: string;
  readonly position: string;
  readonly scene: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    propId: { type: "string", maxLength: 8192 },
    position: { type: "string", maxLength: 8192 },
    scene: { type: "string", maxLength: 8192 },
  },
  required: ["propId", "position", "scene"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a caller-recorded prop preset position and scene without inferring a stage layout. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { propId, position, scene } = request;
  const compute = (): Output => {
    H.domain(
      propId.length > 0 && position.length > 0 && scene.length > 0,
      "propId",
    );
    return { label: propId + " → " + position + " [" + scene + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { propId: "P17", position: "stage-left table", scene: "Scene 2" },
  output: { label: "P17 → stage-left table [Scene 2]" },
} satisfies ToolExample<Input, Output>;
export const propPresetPositionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/prop-preset-position-label",
    title: "Prop Preset Position Label Tool",
    description:
      "Format a caller-recorded prop preset position and scene without inferring a stage layout.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        propId: { type: "string", maxLength: 8192 },
        position: { type: "string", maxLength: 8192 },
        scene: { type: "string", maxLength: 8192 },
      },
      required: ["propId", "position", "scene"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "propId",
          label: "Prop Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "scene",
          label: "Scene",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = propPresetPositionLabelTool.execute;
export default propPresetPositionLabelTool;
