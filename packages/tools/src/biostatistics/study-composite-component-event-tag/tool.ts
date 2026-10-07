import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly compositeId: string;
  readonly componentId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    compositeId: { type: "string", maxLength: 8192, minLength: 1 },
    componentId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "compositeId", "componentId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate an explicitly recorded event component with a supplied composite endpoint identifier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, compositeId, componentId } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(compositeId.length > 0, "compositeId");
    H.domain(componentId.length > 0, "componentId");
    return { token: JSON.stringify([participantId, compositeId, componentId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participantId: "P17", compositeId: "C4", componentId: "E2" },
  output: { token: '["P17","C4","E2"]' },
} satisfies ToolExample<Input, Output>;
export const studyCompositeComponentEventTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/study-composite-component-event-tag",
    title: "Study Composite Component Event Tag",
    description:
      "Associate an explicitly recorded event component with a supplied composite endpoint identifier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        compositeId: { type: "string", maxLength: 8192, minLength: 1 },
        componentId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "compositeId", "componentId"],
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
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "compositeId",
          label: "Composite Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "componentId",
          label: "Component Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = studyCompositeComponentEventTagTool.execute;
export default studyCompositeComponentEventTagTool;
