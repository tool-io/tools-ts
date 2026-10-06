import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scenarioCode: string;
  readonly boundaryCategory: string;
  readonly assessorCode: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scenarioCode: { type: "string", maxLength: 8192, minLength: 1 },
    boundaryCategory: { type: "string", maxLength: 8192, minLength: 1 },
    assessorCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scenarioCode", "boundaryCategory", "assessorCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Encode an explicit scenario/category/assessor annotation without evaluating professional conduct. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scenarioCode, boundaryCategory, assessorCode } = request;
  const compute = (): Output => {
    H.domain(
      scenarioCode.length > 0 &&
        boundaryCategory.length > 0 &&
        assessorCode.length > 0,
      "scenarioCode",
    );
    return {
      tag: JSON.stringify([scenarioCode, boundaryCategory, assessorCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scenarioCode: "S17",
    boundaryCategory: "dual-role",
    assessorCode: "A3",
  },
  output: { tag: '["S17","dual-role","A3"]' },
} satisfies ToolExample<Input, Output>;
export const professionalBoundaryScenarioTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/professional-boundary-scenario-tag",
    title: "Professional Boundary Scenario Tag",
    description:
      "Encode an explicit scenario/category/assessor annotation without evaluating professional conduct.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scenarioCode: { type: "string", maxLength: 8192, minLength: 1 },
        boundaryCategory: { type: "string", maxLength: 8192, minLength: 1 },
        assessorCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["scenarioCode", "boundaryCategory", "assessorCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "scenarioCode",
          label: "Scenario Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "boundaryCategory",
          label: "Boundary Category",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assessorCode",
          label: "Assessor Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = professionalBoundaryScenarioTagTool.execute;
export default professionalBoundaryScenarioTagTool;
