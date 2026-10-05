import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDateText: string;
  readonly firstCalendar: string;
  readonly secondDateText: string;
  readonly secondCalendar: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDateText: { type: "string", maxLength: 8192 },
    firstCalendar: { type: "string", maxLength: 8192 },
    secondDateText: { type: "string", maxLength: 8192 },
    secondCalendar: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstDateText",
    "firstCalendar",
    "secondDateText",
    "secondCalendar",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Display two explicitly transcribed calendar dates without calculating or asserting equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDateText, firstCalendar, secondDateText, secondCalendar } =
    request;
  const compute = (): Output => {
    H.domain(
      firstDateText.length > 0 &&
        firstCalendar.length > 0 &&
        secondDateText.length > 0 &&
        secondCalendar.length > 0,
      "firstDateText",
    );
    return {
      label:
        firstDateText +
        " (" +
        firstCalendar +
        ") / " +
        secondDateText +
        " (" +
        secondCalendar +
        ")",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstDateText: "1 March 1700",
    firstCalendar: "Julian",
    secondDateText: "12 March 1700",
    secondCalendar: "Gregorian",
  },
  output: { label: "1 March 1700 (Julian) / 12 March 1700 (Gregorian)" },
} satisfies ToolExample<Input, Output>;
export const europeanCrossBorderDocumentDualDateLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "european-studies/european-cross-border-document-dual-date-label",
      title: "European Cross Border Document Dual Date Label Tool",
      description:
        "Display two explicitly transcribed calendar dates without calculating or asserting equivalence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstDateText: { type: "string", maxLength: 8192 },
          firstCalendar: { type: "string", maxLength: 8192 },
          secondDateText: { type: "string", maxLength: 8192 },
          secondCalendar: { type: "string", maxLength: 8192 },
        },
        required: [
          "firstDateText",
          "firstCalendar",
          "secondDateText",
          "secondCalendar",
        ],
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
            id: "firstDateText",
            label: "First Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "firstCalendar",
            label: "First Calendar",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondDateText",
            label: "Second Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "secondCalendar",
            label: "Second Calendar",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = europeanCrossBorderDocumentDualDateLabelTool.execute;
export default europeanCrossBorderDocumentDualDateLabelTool;
