import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleCode: string;
  readonly sourceTitle: string;
  readonly editionYear: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleCode: { type: "string", maxLength: 8192 },
    sourceTitle: { type: "string", maxLength: 8192 },
    editionYear: { type: "integer", minimum: 1, maximum: 9999 },
  },
  required: ["cycleCode", "sourceTitle", "editionYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Attach a supplied source edition to a reading-cycle code without computing a liturgical date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleCode, sourceTitle, editionYear } = request;
  const compute = (): Output => {
    H.domain(cycleCode.length > 0 && sourceTitle.length > 0, "cycleCode");
    (H.domain(
      Number.isSafeInteger(editionYear) &&
        editionYear >= 1 &&
        editionYear <= 9999,
      "editionYear",
    ),
      editionYear);
    return { token: cycleCode + " [" + sourceTitle + ", " + editionYear + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cycleCode: "Cycle A",
    sourceTitle: "Public lectionary",
    editionYear: 2020,
  },
  output: { token: "Cycle A [Public lectionary, 2020]" },
} satisfies ToolExample<Input, Output>;
export const liturgicalReadingCycleSourceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "religious-studies/liturgical-reading-cycle-source-token",
    title: "Liturgical Reading Cycle Source Token Tool",
    description:
      "Attach a supplied source edition to a reading-cycle code without computing a liturgical date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleCode: { type: "string", maxLength: 8192 },
        sourceTitle: { type: "string", maxLength: 8192 },
        editionYear: { type: "integer", minimum: 1, maximum: 9999 },
      },
      required: ["cycleCode", "sourceTitle", "editionYear"],
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
          id: "cycleCode",
          label: "Cycle Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceTitle",
          label: "Source Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "editionYear",
          label: "Edition Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = liturgicalReadingCycleSourceTokenTool.execute;
export default liturgicalReadingCycleSourceTokenTool;
