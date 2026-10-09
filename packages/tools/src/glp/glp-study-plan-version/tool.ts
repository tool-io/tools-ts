import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly planId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    planId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "planId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit study-plan reference by version without assessing GLP compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, planId, version } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(planId.length > 0, "planId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([studyId, planId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", planId: "PLAN2", version: "v2" },
  output: { token: '["ST17","PLAN2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const glpStudyPlanVersionTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "glp",
          "good laboratory practice",
          "research and quality management",
        ],
        keywords: [
          "good laboratory practice",
          "research and quality management",
          "GLP",
        ],
      },
      id: "glp/glp-study-plan-version",
      title: "GLP Study Plan Version",
      description:
        "Qualify an explicit study-plan reference by version without assessing GLP compliance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          studyId: { type: "string", maxLength: 8192, minLength: 1 },
          planId: { type: "string", maxLength: 8192, minLength: 1 },
          version: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["studyId", "planId", "version"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "studyId",
            label: "Study Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "planId",
            label: "Plan Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "version",
            label: "Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = glpStudyPlanVersionTool.execute;
export default glpStudyPlanVersionTool;
