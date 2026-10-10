import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly suppliedPhase: string;
  readonly confidenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPhase: { type: "string", maxLength: 8192, minLength: 1 },
    confidenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "suppliedPhase", "confidenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicitly supplied precipitation phase and confidence-source metadata without inferring phase from temperature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, suppliedPhase, confidenceSource } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(suppliedPhase.length > 0, "suppliedPhase");
    H.domain(confidenceSource.length > 0, "confidenceSource");
    return {
      token: JSON.stringify([observationId, suppliedPhase, confidenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    suppliedPhase: "snow",
    confidenceSource: "observer R4",
  },
  output: { token: '["O17","snow","observer R4"]' },
} satisfies ToolExample<Input, Output>;
export const precipitationPhaseSourceConfidenceTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydrometeorology/precipitation-phase-source-confidence-token",
      title: "Precipitation Phase Source Confidence Token Tool",
      description:
        "Preserve explicitly supplied precipitation phase and confidence-source metadata without inferring phase from temperature.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPhase: { type: "string", maxLength: 8192, minLength: 1 },
          confidenceSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["observationId", "suppliedPhase", "confidenceSource"],
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
            id: "observationId",
            label: "Observation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPhase",
            label: "Supplied Phase",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "confidenceSource",
            label: "Confidence Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = precipitationPhaseSourceConfidenceTokenTool.execute;
export default precipitationPhaseSourceConfidenceTokenTool;
