import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assentGranted: boolean;
  readonly parentalPermissionGranted: boolean;
};
export type Output = { readonly bothRecorded: boolean; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assentGranted: { type: "boolean" },
    parentalPermissionGranted: { type: "boolean" },
  },
  required: ["assentGranted", "parentalPermissionGranted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bothRecorded: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["bothRecorded", "label"],
} as const;
/** Display two explicitly recorded permission flags; this does not decide which permissions a study or jurisdiction requires. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assentGranted, parentalPermissionGranted } = request;
  const compute = (): Output => {
    return {
      bothRecorded: assentGranted && parentalPermissionGranted,
      label:
        "assent=" +
        (assentGranted ? "yes" : "no") +
        "; parental permission=" +
        (parentalPermissionGranted ? "yes" : "no"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assentGranted: true, parentalPermissionGranted: false },
  output: { bothRecorded: false, label: "assent=yes; parental permission=no" },
} satisfies ToolExample<Input, Output>;
export const assentParentalPermissionPairLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/assent-parental-permission-pair-label",
    title: "Assent Parental Permission Pair Label Tool",
    description:
      "Display two explicitly recorded permission flags; this does not decide which permissions a study or jurisdiction requires.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assentGranted: { type: "boolean" },
        parentalPermissionGranted: { type: "boolean" },
      },
      required: ["assentGranted", "parentalPermissionGranted"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bothRecorded: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["bothRecorded", "label"],
    },
    ports: {
      inputs: [
        {
          id: "assentGranted",
          label: "Assent Granted",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "parentalPermissionGranted",
          label: "Parental Permission Granted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "bothRecorded",
          label: "Both Recorded",
          valueType: { type: "boolean" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = assentParentalPermissionPairLabelTool.execute;
export default assentParentalPermissionPairLabelTool;
