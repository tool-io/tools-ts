import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly codeSystem: string;
  readonly componentCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    codeSystem: { type: "string", maxLength: 8192, minLength: 1 },
    componentCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "codeSystem", "componentCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode one explicitly supplied FHIR Observation component coding with its code system without validating terminology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, codeSystem, componentCode } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(codeSystem.length > 0, "codeSystem");
    H.domain(componentCode.length > 0, "componentCode");
    return {
      token: JSON.stringify([observationId, codeSystem, componentCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationId: "O17", codeSystem: "system S4", componentCode: "C2" },
  output: { token: '["O17","system S4","C2"]' },
} satisfies ToolExample<Input, Output>;
export const fhirObservationComponentCodePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/fhir-observation-component-code-pair",
    title: "FHIR Observation Component Code Pair Tool",
    description:
      "Encode one explicitly supplied FHIR Observation component coding with its code system without validating terminology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        codeSystem: { type: "string", maxLength: 8192, minLength: 1 },
        componentCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "codeSystem", "componentCode"],
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
          id: "codeSystem",
          label: "Code System",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "componentCode",
          label: "Component Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fhirObservationComponentCodePairTool.execute;
export default fhirObservationComponentCodePairTool;
