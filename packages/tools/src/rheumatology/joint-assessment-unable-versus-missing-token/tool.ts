import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly statuses: readonly string[] };
export type Output = {
  readonly assessed: number;
  readonly unable: number;
  readonly missing: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    statuses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["statuses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessed: { type: "integer" },
    unable: { type: "integer" },
    missing: { type: "integer" },
  },
  required: ["assessed", "unable", "missing"],
} as const;
/** Count explicit assessed, unable and missing site statuses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { statuses } = request;
  const compute = (): Output => {
    H.domain(
      statuses.every((x) => ["assessed", "unable", "missing"].includes(x)),
      "statuses",
    );
    return {
      assessed: statuses.filter((x) => x === "assessed").length,
      unable: statuses.filter((x) => x === "unable").length,
      missing: statuses.filter((x) => x === "missing").length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { statuses: ["assessed", "unable", "missing", "assessed"] },
  output: { assessed: 2, unable: 1, missing: 1 },
} satisfies ToolExample<Input, Output>;
export const jointAssessmentUnableVersusMissingTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "rheumatology/joint-assessment-unable-versus-missing-token",
      title: "Joint Assessment Unable Versus Missing Token Tool",
      description: "Count explicit assessed, unable and missing site statuses.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          statuses: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["statuses"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assessed: { type: "integer" },
          unable: { type: "integer" },
          missing: { type: "integer" },
        },
        required: ["assessed", "unable", "missing"],
      },
      ports: {
        inputs: [
          {
            id: "statuses",
            label: "Statuses",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          { id: "assessed", label: "Assessed", valueType: { type: "integer" } },
          { id: "unable", label: "Unable", valueType: { type: "integer" } },
          { id: "missing", label: "Missing", valueType: { type: "integer" } },
        ],
      },
    },
    calculate,
  });
export const run = jointAssessmentUnableVersusMissingTokenTool.execute;
export default jointAssessmentUnableVersusMissingTokenTool;
