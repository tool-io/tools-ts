import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proteinId: string;
  readonly coefficientText: string;
  readonly conventionText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proteinId: { type: "string", maxLength: 8192, minLength: 1 },
    coefficientText: { type: "string", maxLength: 8192, minLength: 1 },
    conventionText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["proteinId", "coefficientText", "conventionText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit protein absorptivity transcription and dimensional convention without interconverting coefficients. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proteinId, coefficientText, conventionText } = request;
  const compute = (): Output => {
    H.domain(proteinId.length > 0, "proteinId");
    H.domain(coefficientText.length > 0, "coefficientText");
    H.domain(conventionText.length > 0, "conventionText");
    return {
      token: JSON.stringify([proteinId, coefficientText, conventionText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    proteinId: "P17",
    coefficientText: "1.2",
    conventionText: "mass absorptivity L/(g cm)",
  },
  output: { token: '["P17","1.2","mass absorptivity L/(g cm)"]' },
} satisfies ToolExample<Input, Output>;
export const proteinAbsorptivityConventionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/protein-absorptivity-convention-tag",
    title: "Protein Absorptivity Convention Tag",
    description:
      "Preserve an explicit protein absorptivity transcription and dimensional convention without interconverting coefficients.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proteinId: { type: "string", maxLength: 8192, minLength: 1 },
        coefficientText: { type: "string", maxLength: 8192, minLength: 1 },
        conventionText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["proteinId", "coefficientText", "conventionText"],
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
          id: "proteinId",
          label: "Protein Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "coefficientText",
          label: "Coefficient Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conventionText",
          label: "Convention Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = proteinAbsorptivityConventionTagTool.execute;
export default proteinAbsorptivityConventionTagTool;
