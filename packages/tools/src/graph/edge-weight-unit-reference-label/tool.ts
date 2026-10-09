import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly graphId: string;
  readonly weightMeaning: string;
  readonly unitText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    graphId: { type: "string", maxLength: 8192, minLength: 1 },
    weightMeaning: { type: "string", maxLength: 8192, minLength: 1 },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["graphId", "weightMeaning", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit graph edge-weight meaning by unit wording without assigning weights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { graphId, weightMeaning, unitText } = request;
  const compute = (): Output => {
    H.domain(graphId.length > 0, "graphId");
    H.domain(weightMeaning.length > 0, "weightMeaning");
    H.domain(unitText.length > 0, "unitText");
    return { token: JSON.stringify([graphId, weightMeaning, unitText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { graphId: "G17", weightMeaning: "travel time", unitText: "s" },
  output: { token: '["G17","travel time","s"]' },
} satisfies ToolExample<Input, Output>;
export const edgeWeightUnitReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["graph", "mathematics"],
      keywords: ["graph", "mathematics"],
    },
    id: "graph/edge-weight-unit-reference-label",
    title: "Edge Weight Unit Reference Label",
    description:
      "Qualify an explicit graph edge-weight meaning by unit wording without assigning weights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        graphId: { type: "string", maxLength: 8192, minLength: 1 },
        weightMeaning: { type: "string", maxLength: 8192, minLength: 1 },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["graphId", "weightMeaning", "unitText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "graphId",
          label: "Graph Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "weightMeaning",
          label: "Weight Meaning",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = edgeWeightUnitReferenceLabelTool.execute;
export default edgeWeightUnitReferenceLabelTool;
