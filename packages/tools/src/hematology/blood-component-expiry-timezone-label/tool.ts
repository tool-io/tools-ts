import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentId: string;
  readonly expiryLocalText: string;
  readonly timeZoneText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentId: { type: "string", maxLength: 8192, minLength: 1 },
    expiryLocalText: { type: "string", maxLength: 8192, minLength: 1 },
    timeZoneText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["componentId", "expiryLocalText", "timeZoneText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit blood-component expiry time transcription and time-zone label without selecting storage duration or determining usability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentId, expiryLocalText, timeZoneText } = request;
  const compute = (): Output => {
    H.domain(componentId.length > 0, "componentId");
    H.domain(expiryLocalText.length > 0, "expiryLocalText");
    H.domain(timeZoneText.length > 0, "timeZoneText");
    return {
      token: JSON.stringify([componentId, expiryLocalText, timeZoneText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    componentId: "B17",
    expiryLocalText: "2026-11-01 18:00",
    timeZoneText: "UTC",
  },
  output: { token: '["B17","2026-11-01 18:00","UTC"]' },
} satisfies ToolExample<Input, Output>;
export const bloodComponentExpiryTimezoneLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/blood-component-expiry-timezone-label",
    title: "Blood Component Expiry Timezone Label Tool",
    description:
      "Preserve an explicit blood-component expiry time transcription and time-zone label without selecting storage duration or determining usability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentId: { type: "string", maxLength: 8192, minLength: 1 },
        expiryLocalText: { type: "string", maxLength: 8192, minLength: 1 },
        timeZoneText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["componentId", "expiryLocalText", "timeZoneText"],
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
          id: "componentId",
          label: "Component Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryLocalText",
          label: "Expiry Local Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timeZoneText",
          label: "Time Zone Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bloodComponentExpiryTimezoneLabelTool.execute;
export default bloodComponentExpiryTimezoneLabelTool;
