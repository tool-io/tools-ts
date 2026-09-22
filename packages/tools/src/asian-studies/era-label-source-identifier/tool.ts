import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eraLabel: string;
  readonly source: string;
  readonly edition: string;
};
export type Output = { readonly identifier: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eraLabel: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    edition: { type: "string", maxLength: 8192 },
  },
  required: ["eraLabel", "source", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
/** Qualify a supplied era label by its source and edition without calendar conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eraLabel, source, edition } = request;
  const compute = (): Output => {
    return { identifier: JSON.stringify([source, edition, eraLabel]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eraLabel: "Era A", source: "register-4", edition: "edition-2" },
  output: { identifier: '["register-4","edition-2","Era A"]' },
} satisfies ToolExample<Input, Output>;
export const eraLabelSourceIdentifierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/era-label-source-identifier",
    title: "Era Label Source Identifier Tool",
    description:
      "Qualify a supplied era label by its source and edition without calendar conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eraLabel: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        edition: { type: "string", maxLength: 8192 },
      },
      required: ["eraLabel", "source", "edition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { identifier: { type: "string", maxLength: 8192 } },
      required: ["identifier"],
    },
    ports: {
      inputs: [
        {
          id: "eraLabel",
          label: "Era Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
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
      outputs: [
        {
          id: "identifier",
          label: "Identifier",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = eraLabelSourceIdentifierTool.execute;
export default eraLabelSourceIdentifierTool;
