import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly quoteId: string; readonly status: string };
export type Output = { readonly label: string; readonly mayQuote: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quoteId: { type: "string", maxLength: 8192 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["granted", "declined", "pending", "withdrawn"],
    },
  },
  required: ["quoteId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    mayQuote: { type: "boolean" },
  },
  required: ["label", "mayQuote"],
} as const;
/** Render a recorded quote-consent status; mayQuote reflects only the supplied status and is not independent authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quoteId, status } = request;
  const compute = (): Output => {
    H.domain(quoteId.length > 0, "quoteId");
    H.domain(
      ["granted", "declined", "pending", "withdrawn"].includes(status),
      "status",
    );
    return {
      label: quoteId + " [quote consent: " + status + "]",
      mayQuote: status === "granted",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quoteId: "Q-12", status: "granted" },
  output: { label: "Q-12 [quote consent: granted]", mayQuote: true },
} satisfies ToolExample<Input, Output>;
export const interviewQuoteConsentStatusLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/interview-quote-consent-status-label",
    title: "Interview Quote Consent Status Label Tool",
    description:
      "Render a recorded quote-consent status; mayQuote reflects only the supplied status and is not independent authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quoteId: { type: "string", maxLength: 8192 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["granted", "declined", "pending", "withdrawn"],
        },
      },
      required: ["quoteId", "status"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        mayQuote: { type: "boolean" },
      },
      required: ["label", "mayQuote"],
    },
    ports: {
      inputs: [
        {
          id: "quoteId",
          label: "Quote Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        { id: "mayQuote", label: "May Quote", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = interviewQuoteConsentStatusLabelTool.execute;
export default interviewQuoteConsentStatusLabelTool;
