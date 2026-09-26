import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mode: string;
  readonly allowedModes: readonly string[];
  readonly proxy: boolean;
};
export type Output = {
  readonly recognized: boolean;
  readonly responseClass: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: { type: "string", maxLength: 8192 },
    allowedModes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    proxy: { type: "boolean" },
  },
  required: ["mode", "allowedModes", "proxy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    responseClass: { type: "string", maxLength: 8192 },
  },
  required: ["recognized", "responseClass"],
} as const;
/** Classify supplied form-recording metadata without assessing patient capacity or clinical consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mode, allowedModes, proxy } = request;
  const compute = (): Output => {
    return {
      recognized: allowedModes.includes(mode),
      responseClass: proxy ? "proxy-recorded" : "direct-recorded",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mode: "verbal", allowedModes: ["verbal", "written"], proxy: false },
  output: { recognized: true, responseClass: "direct-recorded" },
} satisfies ToolExample<Input, Output>;
export const emergencyFormResponseModeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/emergency-form-response-mode-token",
    title: "Emergency Form Response Mode Token Tool",
    description:
      "Classify supplied form-recording metadata without assessing patient capacity or clinical consent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mode: { type: "string", maxLength: 8192 },
        allowedModes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        proxy: { type: "boolean" },
      },
      required: ["mode", "allowedModes", "proxy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        responseClass: { type: "string", maxLength: 8192 },
      },
      required: ["recognized", "responseClass"],
    },
    ports: {
      inputs: [
        {
          id: "mode",
          label: "Mode",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedModes",
          label: "Allowed Modes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "proxy",
          label: "Proxy",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        {
          id: "responseClass",
          label: "Response Class",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = emergencyFormResponseModeTokenTool.execute;
export default emergencyFormResponseModeTokenTool;
