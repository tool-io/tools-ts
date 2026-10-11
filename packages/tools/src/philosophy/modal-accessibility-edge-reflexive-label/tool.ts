import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceWorld: string;
  readonly targetWorld: string;
};
export type Output = {
  readonly reflexiveEdge: boolean;
  readonly edgeToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceWorld: { type: "string", maxLength: 8192, minLength: 1 },
    targetWorld: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceWorld", "targetWorld"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflexiveEdge: { type: "boolean" },
    edgeToken: { type: "string", maxLength: 8192 },
  },
  required: ["reflexiveEdge", "edgeToken"],
} as const;
/** Label whether an explicit modal accessibility edge is a self-loop without asserting reflexivity of the whole relation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceWorld, targetWorld } = request;
  const compute = (): Output => {
    H.domain(sourceWorld.length > 0 && targetWorld.length > 0, "sourceWorld");
    return {
      reflexiveEdge: sourceWorld === targetWorld,
      edgeToken: JSON.stringify([sourceWorld, targetWorld]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceWorld: "W1", targetWorld: "W1" },
  output: { reflexiveEdge: true, edgeToken: '["W1","W1"]' },
} satisfies ToolExample<Input, Output>;
export const modalAccessibilityEdgeReflexiveLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["philosophy"],
        keywords: ["philosophy"],
      },
      id: "philosophy/modal-accessibility-edge-reflexive-label",
      title: "Modal Accessibility Edge Reflexive Label",
      description:
        "Label whether an explicit modal accessibility edge is a self-loop without asserting reflexivity of the whole relation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceWorld: { type: "string", maxLength: 8192, minLength: 1 },
          targetWorld: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sourceWorld", "targetWorld"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reflexiveEdge: { type: "boolean" },
          edgeToken: { type: "string", maxLength: 8192 },
        },
        required: ["reflexiveEdge", "edgeToken"],
      },
      ports: {
        inputs: [
          {
            id: "sourceWorld",
            label: "Source World",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "targetWorld",
            label: "Target World",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "reflexiveEdge",
            label: "Reflexive Edge",
            valueType: { type: "boolean" },
          },
          {
            id: "edgeToken",
            label: "Edge Token",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = modalAccessibilityEdgeReflexiveLabelTool.execute;
export default modalAccessibilityEdgeReflexiveLabelTool;
