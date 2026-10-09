import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly codeSystem: string;
  readonly codeText: string;
  readonly edition: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codeSystem: { type: "string", maxLength: 8192, minLength: 1 },
    codeText: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["codeSystem", "codeText", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode exact supplied clinical code, system and edition identifiers without terminology lookup or equivalence mapping. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { codeSystem, codeText, edition } = request;
  const compute = (): Output => {
    H.domain(codeSystem.length > 0, "codeSystem");
    H.domain(codeText.length > 0, "codeText");
    H.domain(edition.length > 0, "edition");
    return { token: JSON.stringify([codeSystem, codeText, edition]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { codeSystem: "SYS17", codeText: "00124", edition: "2025" },
  output: { token: '["SYS17","00124","2025"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalCodeSystemEditionKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/clinical-code-system-edition-key",
    title: "Clinical Code System Edition Key Tool",
    description:
      "Encode exact supplied clinical code, system and edition identifiers without terminology lookup or equivalence mapping.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codeSystem: { type: "string", maxLength: 8192, minLength: 1 },
        codeText: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["codeSystem", "codeText", "edition"],
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
          id: "codeSystem",
          label: "Code System",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeText",
          label: "Code Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clinicalCodeSystemEditionKeyTool.execute;
export default clinicalCodeSystemEditionKeyTool;
