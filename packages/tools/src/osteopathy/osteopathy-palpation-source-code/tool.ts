import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly palpationCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    palpationCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "palpationCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly entered palpation code and source without recognizing a finding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, palpationCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(palpationCode.length > 0, "palpationCode");
    H.domain(codeSource.length > 0, "codeSource");
    return {
      token: JSON.stringify([observationId, palpationCode, codeSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationId: "OBS17", palpationCode: "P2", codeSource: "Rater A" },
  output: { token: '["OBS17","P2","Rater A"]' },
} satisfies ToolExample<Input, Output>;
export const osteopathyPalpationSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["osteopathy", "health and medicine"],
      keywords: ["osteopathy", "health and medicine"],
    },
    id: "osteopathy/osteopathy-palpation-source-code",
    title: "Osteopathy Palpation Source Code",
    description:
      "Preserve an explicitly entered palpation code and source without recognizing a finding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        palpationCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "palpationCode", "codeSource"],
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
          id: "palpationCode",
          label: "Palpation Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = osteopathyPalpationSourceCodeTool.execute;
export default osteopathyPalpationSourceCodeTool;
