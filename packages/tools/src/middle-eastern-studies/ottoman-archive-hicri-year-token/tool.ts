import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly year: number; readonly sourceId: string };
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: 1 },
    sourceId: { type: "string", maxLength: 8192 },
  },
  required: ["year", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Label an explicitly transcribed Hijri year with a source identifier without converting calendar systems. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { year, sourceId } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(year) &&
        year >= 1 &&
        year <= Number.MAX_SAFE_INTEGER,
      "year",
    ),
      year);
    H.domain(sourceId.length > 0, "sourceId");
    return { token: year + " AH [" + sourceId + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { year: 1320, sourceId: "Archive A" },
  output: { token: "1320 AH [Archive A]" },
} satisfies ToolExample<Input, Output>;
export const ottomanArchiveHicriYearTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/ottoman-archive-hicri-year-token",
    title: "Ottoman Archive Hicri Year Token Tool",
    description:
      "Label an explicitly transcribed Hijri year with a source identifier without converting calendar systems.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer", minimum: 1 },
        sourceId: { type: "string", maxLength: 8192 },
      },
      required: ["year", "sourceId"],
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
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ottomanArchiveHicriYearTokenTool.execute;
export default ottomanArchiveHicriYearTokenTool;
