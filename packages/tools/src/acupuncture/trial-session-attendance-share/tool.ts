import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly attended: number; readonly planned: number };
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attended: { type: "integer", minimum: 0 },
    planned: { type: "integer", minimum: 0 },
  },
  required: ["attended", "planned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Compute supplied research attendance coverage without a therapy recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { attended, planned } = request;
  const compute = (): Output => {
    H.integer(planned, 0);
    H.integer(attended, 0, planned);
    return {
      share: planned > 0 ? attended / planned : 0,
      defined: planned > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { attended: 3, planned: 4 },
  output: { share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const trialSessionAttendanceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/trial-session-attendance-share",
    title: "Trial Session Attendance Share Tool",
    description:
      "Compute supplied research attendance coverage without a therapy recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attended: { type: "integer", minimum: 0 },
        planned: { type: "integer", minimum: 0 },
      },
      required: ["attended", "planned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "attended",
          label: "Attended",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "planned",
          label: "Planned",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trialSessionAttendanceShareTool.execute;
export default trialSessionAttendanceShareTool;
