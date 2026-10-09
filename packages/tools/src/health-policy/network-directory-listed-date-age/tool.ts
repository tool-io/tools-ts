import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly listedAsOfDate: string;
  readonly currentAsOfDate: string;
};
export type Output = { readonly signedAgeDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listedAsOfDate: { type: "string", maxLength: 8192 },
    currentAsOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["listedAsOfDate", "currentAsOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedAgeDays: { type: "number" } },
  required: ["signedAgeDays"],
} as const;
/** Measure the signed age of an explicitly dated directory listing without confirming current provider network status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { listedAsOfDate, currentAsOfDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return {
      signedAgeDays:
        (namedDate(currentAsOfDate, "currentAsOfDate").getTime() -
          namedDate(listedAsOfDate, "listedAsOfDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { listedAsOfDate: "2026-10-01", currentAsOfDate: "2026-11-01" },
  output: { signedAgeDays: 31 },
} satisfies ToolExample<Input, Output>;
export const networkDirectoryListedDateAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/network-directory-listed-date-age",
    title: "Network Directory Listed Date Age",
    description:
      "Measure the signed age of an explicitly dated directory listing without confirming current provider network status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        listedAsOfDate: { type: "string", maxLength: 8192 },
        currentAsOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["listedAsOfDate", "currentAsOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedAgeDays: { type: "number" } },
      required: ["signedAgeDays"],
    },
    ports: {
      inputs: [
        {
          id: "listedAsOfDate",
          label: "Listed As Of Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentAsOfDate",
          label: "Current As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedAgeDays",
          label: "Signed Age Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = networkDirectoryListedDateAgeTool.execute;
export default networkDirectoryListedDateAgeTool;
