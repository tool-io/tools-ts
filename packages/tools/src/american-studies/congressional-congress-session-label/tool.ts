import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly congressNumber: number;
  readonly sessionNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    congressNumber: { type: "integer", minimum: 1 },
    sessionNumber: { type: "integer", minimum: 1 },
  },
  required: ["congressNumber", "sessionNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format explicit Congress and session numbers without mapping dates to congressional terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { congressNumber, sessionNumber } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(congressNumber) &&
        congressNumber >= 1 &&
        congressNumber <= Number.MAX_SAFE_INTEGER,
      "congressNumber",
    ),
      congressNumber);
    (H.domain(
      Number.isSafeInteger(sessionNumber) &&
        sessionNumber >= 1 &&
        sessionNumber <= Number.MAX_SAFE_INTEGER,
      "sessionNumber",
    ),
      sessionNumber);
    return {
      label: "Congress " + congressNumber + ", session " + sessionNumber,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { congressNumber: 118, sessionNumber: 2 },
  output: { label: "Congress 118, session 2" },
} satisfies ToolExample<Input, Output>;
export const congressionalCongressSessionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/congressional-congress-session-label",
    title: "Congressional Congress Session Label Tool",
    description:
      "Format explicit Congress and session numbers without mapping dates to congressional terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        congressNumber: { type: "integer", minimum: 1 },
        sessionNumber: { type: "integer", minimum: 1 },
      },
      required: ["congressNumber", "sessionNumber"],
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
          id: "congressNumber",
          label: "Congress Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sessionNumber",
          label: "Session Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = congressionalCongressSessionLabelTool.execute;
export default congressionalCongressSessionLabelTool;
