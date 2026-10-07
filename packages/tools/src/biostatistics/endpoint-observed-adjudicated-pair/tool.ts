import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly endpointId: string;
  readonly observedCode: string;
  readonly adjudicatedCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endpointId: { type: "string", maxLength: 8192, minLength: 1 },
    observedCode: { type: "string", maxLength: 8192, minLength: 1 },
    adjudicatedCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["endpointId", "observedCode", "adjudicatedCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit observed and adjudicated endpoint codes as distinct fields without reconciling clinical judgments. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { endpointId, observedCode, adjudicatedCode } = request;
  const compute = (): Output => {
    H.domain(endpointId.length > 0, "endpointId");
    H.domain(observedCode.length > 0, "observedCode");
    H.domain(adjudicatedCode.length > 0, "adjudicatedCode");
    return {
      token: JSON.stringify([endpointId, observedCode, adjudicatedCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    endpointId: "E17",
    observedCode: "positive",
    adjudicatedCode: "negative",
  },
  output: { token: '["E17","positive","negative"]' },
} satisfies ToolExample<Input, Output>;
export const endpointObservedAdjudicatedPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/endpoint-observed-adjudicated-pair",
    title: "Endpoint Observed Adjudicated Pair",
    description:
      "Preserve explicit observed and adjudicated endpoint codes as distinct fields without reconciling clinical judgments.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endpointId: { type: "string", maxLength: 8192, minLength: 1 },
        observedCode: { type: "string", maxLength: 8192, minLength: 1 },
        adjudicatedCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["endpointId", "observedCode", "adjudicatedCode"],
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
          id: "endpointId",
          label: "Endpoint Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "observedCode",
          label: "Observed Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "adjudicatedCode",
          label: "Adjudicated Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = endpointObservedAdjudicatedPairTool.execute;
export default endpointObservedAdjudicatedPairTool;
