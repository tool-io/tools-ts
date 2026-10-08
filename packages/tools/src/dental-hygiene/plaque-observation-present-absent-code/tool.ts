import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assessed: boolean;
  readonly plaqueObserved: boolean;
};
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessed: { type: "boolean" },
    plaqueObserved: { type: "boolean" },
  },
  required: ["assessed", "plaqueObserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Keep an unassessed dental surface distinct from observed plaque absence without computing a clinical index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assessed, plaqueObserved } = request;
  const compute = (): Output => {
    H.domain(!plaqueObserved || assessed, "plaqueObserved");
    return {
      code: !assessed ? "not-assessed" : plaqueObserved ? "present" : "absent",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assessed: true, plaqueObserved: false },
  output: { code: "absent" },
} satisfies ToolExample<Input, Output>;
export const plaqueObservationPresentAbsentCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/plaque-observation-present-absent-code",
    title: "Plaque Observation Present Absent Code",
    description:
      "Keep an unassessed dental surface distinct from observed plaque absence without computing a clinical index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assessed: { type: "boolean" },
        plaqueObserved: { type: "boolean" },
      },
      required: ["assessed", "plaqueObserved"],
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
          id: "assessed",
          label: "Assessed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "plaqueObserved",
          label: "Plaque Observed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = plaqueObservationPresentAbsentCodeTool.execute;
export default plaqueObservationPresentAbsentCodeTool;
