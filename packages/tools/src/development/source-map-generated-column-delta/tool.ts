import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousGeneratedColumn: number;
  readonly currentGeneratedColumn: number;
};
export type Output = { readonly columnDelta: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousGeneratedColumn: { type: "integer", minimum: 0 },
    currentGeneratedColumn: { type: "integer", minimum: 0 },
  },
  required: ["previousGeneratedColumn", "currentGeneratedColumn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { columnDelta: { type: "integer" } },
  required: ["columnDelta"],
} as const;
/** Subtract explicit generated source-map columns within a caller-established line without encoding VLQ or carrying columns across lines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousGeneratedColumn, currentGeneratedColumn } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousGeneratedColumn) &&
        previousGeneratedColumn >= 0 &&
        previousGeneratedColumn <= Number.MAX_SAFE_INTEGER,
      "previousGeneratedColumn",
    ),
      previousGeneratedColumn);
    (H.domain(
      Number.isSafeInteger(currentGeneratedColumn) &&
        currentGeneratedColumn >= 0 &&
        currentGeneratedColumn <= Number.MAX_SAFE_INTEGER,
      "currentGeneratedColumn",
    ),
      currentGeneratedColumn);
    return { columnDelta: currentGeneratedColumn - previousGeneratedColumn };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousGeneratedColumn: 12, currentGeneratedColumn: 20 },
  output: { columnDelta: 8 },
} satisfies ToolExample<Input, Output>;
export const sourceMapGeneratedColumnDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["development", "software development", "computer science"],
      keywords: ["software development", "computer science"],
    },
    id: "development/source-map-generated-column-delta",
    title: "Source Map Generated Column Delta",
    description:
      "Subtract explicit generated source-map columns within a caller-established line without encoding VLQ or carrying columns across lines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousGeneratedColumn: { type: "integer", minimum: 0 },
        currentGeneratedColumn: { type: "integer", minimum: 0 },
      },
      required: ["previousGeneratedColumn", "currentGeneratedColumn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { columnDelta: { type: "integer" } },
      required: ["columnDelta"],
    },
    ports: {
      inputs: [
        {
          id: "previousGeneratedColumn",
          label: "Previous Generated Column",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "currentGeneratedColumn",
          label: "Current Generated Column",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "columnDelta",
          label: "Column Delta",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sourceMapGeneratedColumnDeltaTool.execute;
export default sourceMapGeneratedColumnDeltaTool;
