import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthDate: string;
  readonly testingDate: string;
};
export type Output = { readonly ageDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthDate: { type: "string", maxLength: 8192 },
    testingDate: { type: "string", maxLength: 8192 },
  },
  required: ["birthDate", "testingDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageDays: { type: "integer" } },
  required: ["ageDays"],
} as const;
/** Count chronological Gregorian calendar days from an explicit birth date to a testing date without applying age corrections or developmental norms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthDate, testingDate } = request;
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
    const a = namedDate(birthDate, "birthDate").getTime(),
      b = namedDate(testingDate, "testingDate").getTime();
    H.domain(b >= a, "testingDate");
    return { ageDays: (b - a) / 86400000 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthDate: "2020-11-01", testingDate: "2026-11-01" },
  output: { ageDays: 2191 },
} satisfies ToolExample<Input, Output>;
export const childAgeTestingDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "developmental-psychology",
        "developmental psychology",
        "psychology",
      ],
      keywords: ["developmental psychology", "psychology"],
    },
    id: "developmental-psychology/child-age-testing-date-offset",
    title: "Child Age Testing Date Offset",
    description:
      "Count chronological Gregorian calendar days from an explicit birth date to a testing date without applying age corrections or developmental norms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthDate: { type: "string", maxLength: 8192 },
        testingDate: { type: "string", maxLength: 8192 },
      },
      required: ["birthDate", "testingDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageDays: { type: "integer" } },
      required: ["ageDays"],
    },
    ports: {
      inputs: [
        {
          id: "birthDate",
          label: "Birth Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "testingDate",
          label: "Testing Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = childAgeTestingDateOffsetTool.execute;
export default childAgeTestingDateOffsetTool;
