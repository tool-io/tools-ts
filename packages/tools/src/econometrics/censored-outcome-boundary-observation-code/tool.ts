import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly censoring: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    censoring: {
      type: "string",
      maxLength: 8192,
      enum: ["uncensored", "left", "right", "interval", "unknown"],
    },
  },
  required: ["observationId", "censoring"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve an explicit outcome censoring code without substituting boundary values or fitting a censored regression. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, censoring } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(
      ["uncensored", "left", "right", "interval", "unknown"].includes(
        censoring,
      ),
      "censoring",
    );
    return { label: observationId + " [" + censoring + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationId: "O17", censoring: "left" },
  output: { label: "O17 [left]" },
} satisfies ToolExample<Input, Output>;
export const censoredOutcomeBoundaryObservationCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/censored-outcome-boundary-observation-code",
      title: "Censored Outcome Boundary Observation Code Tool",
      description:
        "Preserve an explicit outcome censoring code without substituting boundary values or fitting a censored regression.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationId: { type: "string", maxLength: 8192, minLength: 1 },
          censoring: {
            type: "string",
            maxLength: 8192,
            enum: ["uncensored", "left", "right", "interval", "unknown"],
          },
        },
        required: ["observationId", "censoring"],
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
            id: "observationId",
            label: "Observation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "censoring",
            label: "Censoring",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = censoredOutcomeBoundaryObservationCodeTool.execute;
export default censoredOutcomeBoundaryObservationCodeTool;
