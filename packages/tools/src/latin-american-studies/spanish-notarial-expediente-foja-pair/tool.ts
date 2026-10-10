import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archiveId: string;
  readonly expedienteText: string;
  readonly fojaText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archiveId: { type: "string", maxLength: 8192, minLength: 1 },
    expedienteText: { type: "string", maxLength: 8192, minLength: 1 },
    fojaText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["archiveId", "expedienteText", "fojaText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an explicit notarial expediente-folio locator without interpreting notarial content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archiveId, expedienteText, fojaText } = request;
  const compute = (): Output => {
    H.domain(archiveId.length > 0, "archiveId");
    H.domain(expedienteText.length > 0, "expedienteText");
    H.domain(fojaText.length > 0, "fojaText");
    return { token: JSON.stringify([archiveId, expedienteText, fojaText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { archiveId: "AR17", expedienteText: "Exp. 42", fojaText: "3r" },
  output: { token: '["AR17","Exp. 42","3r"]' },
} satisfies ToolExample<Input, Output>;
export const spanishNotarialExpedienteFojaPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "latin-american-studies",
        "latin american studies",
        "humanities",
      ],
      keywords: ["latin american studies", "humanities"],
    },
    id: "latin-american-studies/spanish-notarial-expediente-foja-pair",
    title: "Spanish Notarial Expediente Foja Pair",
    description:
      "Build an explicit notarial expediente-folio locator without interpreting notarial content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        archiveId: { type: "string", maxLength: 8192, minLength: 1 },
        expedienteText: { type: "string", maxLength: 8192, minLength: 1 },
        fojaText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["archiveId", "expedienteText", "fojaText"],
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
          id: "archiveId",
          label: "Archive Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expedienteText",
          label: "Expediente Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fojaText",
          label: "Foja Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = spanishNotarialExpedienteFojaPairTool.execute;
export default spanishNotarialExpedienteFojaPairTool;
