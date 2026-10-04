import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nameText: string;
  readonly recordedRole: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nameText: { type: "string", maxLength: 8192 },
    recordedRole: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["nameText", "recordedRole", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a literal colophon name with its explicitly recorded role and source without resolving historical identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nameText, recordedRole, source } = request;
  const compute = (): Output => {
    H.domain(
      nameText.length > 0 && recordedRole.length > 0 && source.length > 0,
      "nameText",
    );
    return { label: nameText + " [" + recordedRole + "; " + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nameText: "Printer A",
    recordedRole: "printer",
    source: "Colophon 1",
  },
  output: { label: "Printer A [printer; Colophon 1]" },
} satisfies ToolExample<Input, Output>;
export const asianColophonPrinterRoleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/asian-colophon-printer-role-label",
    title: "Asian Colophon Printer Role Label Tool",
    description:
      "Label a literal colophon name with its explicitly recorded role and source without resolving historical identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nameText: { type: "string", maxLength: 8192 },
        recordedRole: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["nameText", "recordedRole", "source"],
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
          id: "nameText",
          label: "Name Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedRole",
          label: "Recorded Role",
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
export const run = asianColophonPrinterRoleLabelTool.execute;
export default asianColophonPrinterRoleLabelTool;
