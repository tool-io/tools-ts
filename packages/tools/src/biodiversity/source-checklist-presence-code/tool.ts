import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly surveyed: boolean; readonly present: boolean };
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { surveyed: { type: "boolean" }, present: { type: "boolean" } },
  required: ["surveyed", "present"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Keep unsurveyed checklist entries distinct from surveyed nondetections using explicit flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surveyed, present } = request;
  const compute = (): Output => {
    H.domain(!present || surveyed, "present");
    return {
      code: !surveyed ? "not-surveyed" : present ? "present" : "not-detected",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { surveyed: true, present: false },
  output: { code: "not-detected" },
} satisfies ToolExample<Input, Output>;
export const sourceChecklistPresenceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/source-checklist-presence-code",
    title: "Source Checklist Presence Code",
    description:
      "Keep unsurveyed checklist entries distinct from surveyed nondetections using explicit flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surveyed: { type: "boolean" },
        present: { type: "boolean" },
      },
      required: ["surveyed", "present"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    ports: {
      inputs: [
        {
          id: "surveyed",
          label: "Surveyed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "present",
          label: "Present",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sourceChecklistPresenceCodeTool.execute;
export default sourceChecklistPresenceCodeTool;
