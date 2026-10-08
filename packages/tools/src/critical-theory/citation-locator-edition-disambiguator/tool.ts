import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly editionId: string;
  readonly locator: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    locator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["workId", "editionId", "locator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an edition-qualified citation locator from explicit work, edition and locator text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, editionId, locator } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0, "workId");
    H.domain(editionId.length > 0, "editionId");
    H.domain(locator.length > 0, "locator");
    return { token: JSON.stringify([workId, editionId, locator]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workId: "W17", editionId: "E4", locator: "p. 24" },
  output: { token: '["W17","E4","p. 24"]' },
} satisfies ToolExample<Input, Output>;
export const citationLocatorEditionDisambiguatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["critical-theory", "critical theory", "humanities"],
        keywords: ["critical theory", "humanities"],
      },
      id: "critical-theory/citation-locator-edition-disambiguator",
      title: "Citation Locator Edition Disambiguator",
      description:
        "Build an edition-qualified citation locator from explicit work, edition and locator text.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          workId: { type: "string", maxLength: 8192, minLength: 1 },
          editionId: { type: "string", maxLength: 8192, minLength: 1 },
          locator: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["workId", "editionId", "locator"],
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
            id: "workId",
            label: "Work Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "editionId",
            label: "Edition Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "locator",
            label: "Locator",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = citationLocatorEditionDisambiguatorTool.execute;
export default citationLocatorEditionDisambiguatorTool;
