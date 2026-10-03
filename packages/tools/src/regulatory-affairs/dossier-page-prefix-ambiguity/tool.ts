import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedPrefix: string;
  readonly pageIdentifiers: readonly string[];
};
export type Output = {
  readonly matches: readonly string[];
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedPrefix: { type: "string", maxLength: 8192 },
    pageIdentifiers: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requestedPrefix", "pageIdentifiers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    ambiguous: { type: "boolean" },
  },
  required: ["matches", "ambiguous"],
} as const;
/** Find literal supplied page-identifier prefix collisions without validating a dossier structure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedPrefix, pageIdentifiers } = request;
  const compute = (): Output => {
    const matches = pageIdentifiers.filter((x) =>
      x.startsWith(requestedPrefix),
    );
    return { matches, ambiguous: matches.length > 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedPrefix: "A1", pageIdentifiers: ["A10", "A11", "B1"] },
  output: { matches: ["A10", "A11"], ambiguous: true },
} satisfies ToolExample<Input, Output>;
export const dossierPagePrefixAmbiguityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/dossier-page-prefix-ambiguity",
    title: "Dossier Page Prefix Ambiguity Tool",
    description:
      "Find literal supplied page-identifier prefix collisions without validating a dossier structure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedPrefix: { type: "string", maxLength: 8192 },
        pageIdentifiers: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requestedPrefix", "pageIdentifiers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        ambiguous: { type: "boolean" },
      },
      required: ["matches", "ambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "requestedPrefix",
          label: "Requested Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pageIdentifiers",
          label: "Page Identifiers",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "matches",
          label: "Matches",
          valueType: { type: "list", items: { type: "string" } },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dossierPagePrefixAmbiguityTool.execute;
export default dossierPagePrefixAmbiguityTool;
