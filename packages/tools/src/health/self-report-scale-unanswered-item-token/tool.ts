import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly missingToken: string;
  readonly allowed: readonly string[];
};
export type Output = {
  readonly missing: boolean;
  readonly recognized: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    missingToken: { type: "string", maxLength: 8192 },
    allowed: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["token", "missingToken", "allowed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missing: { type: "boolean" }, recognized: { type: "boolean" } },
  required: ["missing", "recognized"],
} as const;
/** Calculate self report scale unanswered item token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, missingToken, allowed } = request;
  const compute = (): Output => {
    const missing = token === missingToken;
    H.domain(!allowed.includes(missingToken));
    return { missing, recognized: missing || allowed.includes(token) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "NA", missingToken: "NA", allowed: ["1", "2", "3"] },
  output: { missing: true, recognized: true },
} satisfies ToolExample<Input, Output>;
export const selfReportScaleUnansweredItemTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/self-report-scale-unanswered-item-token",
    title: "Self Report Scale Unanswered Item Token Tool",
    description:
      "Calculate self report scale unanswered item token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        missingToken: { type: "string", maxLength: 8192 },
        allowed: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["token", "missingToken", "allowed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missing: { type: "boolean" },
        recognized: { type: "boolean" },
      },
      required: ["missing", "recognized"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "missingToken",
          label: "Missing Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowed",
          label: "Allowed",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = selfReportScaleUnansweredItemTokenTool.execute;
export default selfReportScaleUnansweredItemTokenTool;
