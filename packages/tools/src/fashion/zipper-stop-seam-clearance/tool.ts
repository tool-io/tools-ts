import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zipperStopPosition: number;
  readonly seamPosition: number;
  readonly requiredClearance: number;
};
export type Output = { readonly clearance: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zipperStopPosition: { type: "number" },
    seamPosition: { type: "number" },
    requiredClearance: { type: "number", minimum: 0 },
  },
  required: ["zipperStopPosition", "seamPosition", "requiredClearance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clearance: { type: "number" }, margin: { type: "number" } },
  required: ["clearance", "margin"],
} as const;
/** Calculate zipper stop seam clearance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zipperStopPosition, seamPosition, requiredClearance } = request;
  const compute = (): Output => {
    H.domain(requiredClearance >= 0);
    return {
      clearance: Math.abs(zipperStopPosition - seamPosition),
      margin: Math.abs(zipperStopPosition - seamPosition) - requiredClearance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zipperStopPosition: 20, seamPosition: 25, requiredClearance: 3 },
  output: { clearance: 5, margin: 2 },
} satisfies ToolExample<Input, Output>;
export const zipperStopSeamClearanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/zipper-stop-seam-clearance",
    title: "Zipper Stop Seam Clearance Tool",
    description:
      "Calculate zipper stop seam clearance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zipperStopPosition: { type: "number" },
        seamPosition: { type: "number" },
        requiredClearance: { type: "number", minimum: 0 },
      },
      required: ["zipperStopPosition", "seamPosition", "requiredClearance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { clearance: { type: "number" }, margin: { type: "number" } },
      required: ["clearance", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "zipperStopPosition",
          label: "Zipper Stop Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seamPosition",
          label: "Seam Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredClearance",
          label: "Required Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clearance", label: "Clearance", valueType: { type: "number" } },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = zipperStopSeamClearanceTool.execute;
export default zipperStopSeamClearanceTool;
