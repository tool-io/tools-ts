import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workIds: readonly string[];
  readonly startNumber: number;
};
export type Output = { readonly labels: readonly string[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    startNumber: { type: "integer", minimum: 1 },
  },
  required: ["workIds", "startNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["labels"],
} as const;
/** Number a caller-ordered portfolio work sequence from an explicit positive starting number without reordering it. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workIds, startNumber } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startNumber) &&
        startNumber >= 1 &&
        startNumber <= Number.MAX_SAFE_INTEGER,
      "startNumber",
    ),
      startNumber);
    H.domain(
      workIds.every((v) => v.length > 0),
      "workIds",
    );
    return { labels: workIds.map((v, i) => startNumber + i + ". " + v) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workIds: ["Drawing A", "Study B"], startNumber: 3 },
  output: { labels: ["3. Drawing A", "4. Study B"] },
} satisfies ToolExample<Input, Output>;
export const portfolioSequenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/portfolio-sequence-label",
    title: "Portfolio Sequence Label",
    description:
      "Number a caller-ordered portfolio work sequence from an explicit positive starting number without reordering it.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        startNumber: { type: "integer", minimum: 1 },
      },
      required: ["workIds", "startNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["labels"],
    },
    ports: {
      inputs: [
        {
          id: "workIds",
          label: "Work Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "startNumber",
          label: "Start Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "labels",
          label: "Labels",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = portfolioSequenceLabelTool.execute;
export default portfolioSequenceLabelTool;
