import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gazetteReference: string;
  readonly pageText: string;
  readonly annexText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gazetteReference: { type: "string", maxLength: 8192, minLength: 1 },
    pageText: { type: "string", maxLength: 8192, minLength: 1 },
    annexText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["gazetteReference", "pageText", "annexText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit gazette annex-page locator without retrieving or interpreting law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gazetteReference, pageText, annexText } = request;
  const compute = (): Output => {
    H.domain(gazetteReference.length > 0, "gazetteReference");
    H.domain(pageText.length > 0, "pageText");
    H.domain(annexText.length > 0, "annexText");
    return { token: JSON.stringify([gazetteReference, pageText, annexText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gazetteReference: "GAZ17", pageText: "42", annexText: "Annex II" },
  output: { token: '["GAZ17","42","Annex II"]' },
} satisfies ToolExample<Input, Output>;
export const euGazettePageAnnexLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["european-studies", "european studies", "humanities"],
      keywords: ["european studies", "humanities"],
    },
    id: "european-studies/eu-gazette-page-annex-locator",
    title: "Eu Gazette Page Annex Locator",
    description:
      "Qualify an explicit gazette annex-page locator without retrieving or interpreting law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gazetteReference: { type: "string", maxLength: 8192, minLength: 1 },
        pageText: { type: "string", maxLength: 8192, minLength: 1 },
        annexText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["gazetteReference", "pageText", "annexText"],
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
          id: "gazetteReference",
          label: "Gazette Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pageText",
          label: "Page Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "annexText",
          label: "Annex Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = euGazettePageAnnexLocatorTool.execute;
export default euGazettePageAnnexLocatorTool;
