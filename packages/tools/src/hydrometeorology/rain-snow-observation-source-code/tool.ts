import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly phaseCode: string;
  readonly codebookSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    phaseCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "phaseCode", "codebookSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied precipitation-phase code and source without inferring phase from temperature. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, phaseCode, codebookSource } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(phaseCode.length > 0, "phaseCode");
    H.domain(codebookSource.length > 0, "codebookSource");
    return {
      token: JSON.stringify([observationId, phaseCode, codebookSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    phaseCode: "RAIN",
    codebookSource: "Station key A",
  },
  output: { token: '["O17","RAIN","Station key A"]' },
} satisfies ToolExample<Input, Output>;
export const rainSnowObservationSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["hydrometeorology", "earth and environmental sciences"],
      keywords: ["hydrometeorology", "earth and environmental sciences"],
    },
    id: "hydrometeorology/rain-snow-observation-source-code",
    title: "Rain Snow Observation Source Code",
    description:
      "Record a supplied precipitation-phase code and source without inferring phase from temperature.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        phaseCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "phaseCode", "codebookSource"],
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
          id: "phaseCode",
          label: "Phase Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codebookSource",
          label: "Codebook Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = rainSnowObservationSourceCodeTool.execute;
export default rainSnowObservationSourceCodeTool;
