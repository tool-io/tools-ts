import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fonds: string;
  readonly cote: string;
  readonly separator: string;
};
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fonds: { type: "string", maxLength: 8192 },
    cote: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["fonds", "cote", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Join literal fonds and cote fields using an explicitly chosen display separator, preserving identifier padding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fonds, cote, separator } = request;
  const compute = (): Output => {
    H.domain(
      fonds.length > 0 && cote.length > 0 && separator.length > 0,
      "fonds",
    );
    return { reference: fonds + separator + cote };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fonds: "Fonds A", cote: "12/3", separator: " — " },
  output: { reference: "Fonds A — 12/3" },
} satisfies ToolExample<Input, Output>;
export const europeanArchiveFondsCoteSeparatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/european-archive-fonds-cote-separator",
    title: "European Archive Fonds Cote Separator Tool",
    description:
      "Join literal fonds and cote fields using an explicitly chosen display separator, preserving identifier padding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fonds: { type: "string", maxLength: 8192 },
        cote: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["fonds", "cote", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
    },
    ports: {
      inputs: [
        {
          id: "fonds",
          label: "Fonds",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "cote",
          label: "Cote",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = europeanArchiveFondsCoteSeparatorTool.execute;
export default europeanArchiveFondsCoteSeparatorTool;
