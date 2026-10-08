import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceId: string;
  readonly firstLine: number;
  readonly lastLine: number;
  readonly contextWording: string;
};
export type Output = {
  readonly inclusiveLines: number;
  readonly locator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    firstLine: { type: "integer", minimum: 1 },
    lastLine: { type: "integer" },
    contextWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceId", "firstLine", "lastLine", "contextWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inclusiveLines: { type: "integer" },
    locator: { type: "string", maxLength: 8192 },
  },
  required: ["inclusiveLines", "locator"],
} as const;
/** Build an explicit inclusive line-span quotation locator with supplied context without retrieving or interpreting the quotation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceId, firstLine, lastLine, contextWording } = request;
  const compute = (): Output => {
    H.domain(sourceId.length > 0 && contextWording.length > 0, "sourceId");
    (H.domain(
      Number.isSafeInteger(firstLine) &&
        firstLine >= 1 &&
        firstLine <= Number.MAX_SAFE_INTEGER,
      "firstLine",
    ),
      firstLine);
    (H.domain(
      Number.isSafeInteger(lastLine) &&
        lastLine >= firstLine &&
        lastLine <= Number.MAX_SAFE_INTEGER,
      "lastLine",
    ),
      lastLine);
    return {
      inclusiveLines: lastLine - firstLine + 1,
      locator: JSON.stringify([sourceId, firstLine, lastLine, contextWording]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceId: "SRC17",
    firstLine: 12,
    lastLine: 15,
    contextWording: "discussion",
  },
  output: { inclusiveLines: 4, locator: '["SRC17",12,15,"discussion"]' },
} satisfies ToolExample<Input, Output>;
export const culturalQuotationContextLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cultural-studies", "cultural studies", "humanities"],
      keywords: ["cultural studies", "humanities"],
    },
    id: "cultural-studies/cultural-quotation-context-locator",
    title: "Cultural Quotation Context Locator",
    description:
      "Build an explicit inclusive line-span quotation locator with supplied context without retrieving or interpreting the quotation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        firstLine: { type: "integer", minimum: 1 },
        lastLine: { type: "integer" },
        contextWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceId", "firstLine", "lastLine", "contextWording"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inclusiveLines: { type: "integer" },
        locator: { type: "string", maxLength: 8192 },
      },
      required: ["inclusiveLines", "locator"],
    },
    ports: {
      inputs: [
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstLine",
          label: "First Line",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lastLine",
          label: "Last Line",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contextWording",
          label: "Context Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "inclusiveLines",
          label: "Inclusive Lines",
          valueType: { type: "integer" },
        },
        { id: "locator", label: "Locator", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = culturalQuotationContextLocatorTool.execute;
export default culturalQuotationContextLocatorTool;
