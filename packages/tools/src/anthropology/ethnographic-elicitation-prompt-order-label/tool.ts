import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionId: string;
  readonly promptId: string;
  readonly oneBasedPosition: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
    promptId: { type: "string", maxLength: 8192, minLength: 1 },
    oneBasedPosition: { type: "integer", minimum: 1 },
  },
  required: ["sessionId", "promptId", "oneBasedPosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit elicitation prompt position without choosing or randomizing prompt order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionId, promptId, oneBasedPosition } = request;
  const compute = (): Output => {
    H.domain(sessionId.length > 0 && promptId.length > 0, "sessionId");
    (H.domain(
      Number.isSafeInteger(oneBasedPosition) &&
        oneBasedPosition >= 1 &&
        oneBasedPosition <= Number.MAX_SAFE_INTEGER,
      "oneBasedPosition",
    ),
      oneBasedPosition);
    return {
      label: sessionId + " #" + oneBasedPosition + " [" + promptId + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionId: "S17", promptId: "PROMPT2", oneBasedPosition: 3 },
  output: { label: "S17 #3 [PROMPT2]" },
} satisfies ToolExample<Input, Output>;
export const ethnographicElicitationPromptOrderLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["anthropology", "social sciences"],
        keywords: ["anthropology", "social sciences"],
      },
      id: "anthropology/ethnographic-elicitation-prompt-order-label",
      title: "Ethnographic Elicitation Prompt Order Label",
      description:
        "Label an explicit elicitation prompt position without choosing or randomizing prompt order.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessionId: { type: "string", maxLength: 8192, minLength: 1 },
          promptId: { type: "string", maxLength: 8192, minLength: 1 },
          oneBasedPosition: { type: "integer", minimum: 1 },
        },
        required: ["sessionId", "promptId", "oneBasedPosition"],
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
            id: "sessionId",
            label: "Session Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "promptId",
            label: "Prompt Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "oneBasedPosition",
            label: "One Based Position",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = ethnographicElicitationPromptOrderLabelTool.execute;
export default ethnographicElicitationPromptOrderLabelTool;
