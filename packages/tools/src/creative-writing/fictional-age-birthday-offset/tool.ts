import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthYear: number;
  readonly currentYear: number;
  readonly birthdayOccurred: boolean;
};
export type Output = { readonly age: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthYear: { type: "integer" },
    currentYear: { type: "integer" },
    birthdayOccurred: { type: "boolean" },
  },
  required: ["birthYear", "currentYear", "birthdayOccurred"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { age: { type: "integer" } },
  required: ["age"],
} as const;
/** Same-calendar age using astronomical years and an explicit birthday-passed flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthYear, currentYear, birthdayOccurred } = request;
  const compute = (): Output => {
    const age = currentYear - birthYear - (birthdayOccurred ? 0 : 1);
    H.domain(age >= 0);
    return { age };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthYear: 2000, currentYear: 2026, birthdayOccurred: false },
  output: { age: 25 },
} satisfies ToolExample<Input, Output>;
export const fictionalAgeBirthdayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "creative-writing/fictional-age-birthday-offset",
    title: "Fictional Age Birthday Offset Tool",
    description:
      "Same-calendar age using astronomical years and an explicit birthday-passed flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthYear: { type: "integer" },
        currentYear: { type: "integer" },
        birthdayOccurred: { type: "boolean" },
      },
      required: ["birthYear", "currentYear", "birthdayOccurred"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { age: { type: "integer" } },
      required: ["age"],
    },
    ports: {
      inputs: [
        {
          id: "birthYear",
          label: "Birth Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "currentYear",
          label: "Current Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "birthdayOccurred",
          label: "Birthday Occurred",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "age", label: "Age", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = fictionalAgeBirthdayOffsetTool.execute;
export default fictionalAgeBirthdayOffsetTool;
