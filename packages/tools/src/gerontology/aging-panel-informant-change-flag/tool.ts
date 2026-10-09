import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousInformantId: string;
  readonly currentInformantId: string;
};
export type Output = { readonly informantChanged: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousInformantId: { type: "string", maxLength: 8192, minLength: 1 },
    currentInformantId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["previousInformantId", "currentInformantId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { informantChanged: { type: "boolean" } },
  required: ["informantChanged"],
} as const;
/** Compare exact supplied aging-panel informant identifiers without judging reporting consistency or capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousInformantId, currentInformantId } = request;
  const compute = (): Output => {
    H.domain(previousInformantId.length > 0, "previousInformantId");
    H.domain(currentInformantId.length > 0, "currentInformantId");
    return { informantChanged: previousInformantId !== currentInformantId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousInformantId: "I17", currentInformantId: "I18" },
  output: { informantChanged: true },
} satisfies ToolExample<Input, Output>;
export const agingPanelInformantChangeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gerontology/aging-panel-informant-change-flag",
    title: "Aging Panel Informant Change Flag Tool",
    description:
      "Compare exact supplied aging-panel informant identifiers without judging reporting consistency or capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousInformantId: { type: "string", maxLength: 8192, minLength: 1 },
        currentInformantId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["previousInformantId", "currentInformantId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { informantChanged: { type: "boolean" } },
      required: ["informantChanged"],
    },
    ports: {
      inputs: [
        {
          id: "previousInformantId",
          label: "Previous Informant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentInformantId",
          label: "Current Informant Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "informantChanged",
          label: "Informant Changed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = agingPanelInformantChangeFlagTool.execute;
export default agingPanelInformantChangeFlagTool;
