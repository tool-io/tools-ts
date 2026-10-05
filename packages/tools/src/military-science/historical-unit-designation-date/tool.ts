import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly designation: string;
  readonly dateText: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    designation: { type: "string", maxLength: 8192 },
    dateText: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["designation", "dateText", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit historical date and source to a unit designation without inferring modern organization or capability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { designation, dateText, source } = request;
  const compute = (): Output => {
    H.domain(
      designation.length > 0 && dateText.length > 0 && source.length > 0,
      "designation",
    );
    return { label: designation + " [" + dateText + "; " + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    designation: "Historical Unit A",
    dateText: "1918",
    source: "Archive 12",
  },
  output: { label: "Historical Unit A [1918; Archive 12]" },
} satisfies ToolExample<Input, Output>;
export const historicalUnitDesignationDateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/historical-unit-designation-date",
    title: "Historical Unit Designation Date Tool",
    description:
      "Attach an explicit historical date and source to a unit designation without inferring modern organization or capability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        designation: { type: "string", maxLength: 8192 },
        dateText: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["designation", "dateText", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "designation",
          label: "Designation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalUnitDesignationDateTool.execute;
export default historicalUnitDesignationDateTool;
