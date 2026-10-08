import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sceneId: string;
  readonly dateText: string;
  readonly uncertaintyText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sceneId: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    uncertaintyText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sceneId", "dateText", "uncertaintyText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an invented date and its supplied uncertainty wording without applying a real-world calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sceneId, dateText, uncertaintyText } = request;
  const compute = (): Output => {
    H.domain(sceneId.length > 0, "sceneId");
    H.domain(dateText.length > 0, "dateText");
    H.domain(uncertaintyText.length > 0, "uncertaintyText");
    return { token: JSON.stringify([sceneId, dateText, uncertaintyText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sceneId: "S17",
    dateText: "third frost",
    uncertaintyText: "approximate",
  },
  output: { token: '["S17","third frost","approximate"]' },
} satisfies ToolExample<Input, Output>;
export const fictionalDateUncertaintyLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/fictional-date-uncertainty-label",
    title: "Fictional Date Uncertainty Label",
    description:
      "Preserve an invented date and its supplied uncertainty wording without applying a real-world calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sceneId: { type: "string", maxLength: 8192, minLength: 1 },
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        uncertaintyText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sceneId", "dateText", "uncertaintyText"],
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
          id: "sceneId",
          label: "Scene Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "uncertaintyText",
          label: "Uncertainty Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fictionalDateUncertaintyLabelTool.execute;
export default fictionalDateUncertaintyLabelTool;
