import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyId: string;
  readonly archiveContainerId: string;
  readonly locationCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyId: { type: "string", maxLength: 8192, minLength: 1 },
    archiveContainerId: { type: "string", maxLength: 8192, minLength: 1 },
    locationCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["studyId", "archiveContainerId", "locationCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit study archive location without accessing storage or determining retention requirements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyId, archiveContainerId, locationCode } = request;
  const compute = (): Output => {
    H.domain(studyId.length > 0, "studyId");
    H.domain(archiveContainerId.length > 0, "archiveContainerId");
    H.domain(locationCode.length > 0, "locationCode");
    return {
      token: JSON.stringify([studyId, archiveContainerId, locationCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyId: "ST17", archiveContainerId: "BOX2", locationCode: "LOC2" },
  output: { token: '["ST17","BOX2","LOC2"]' },
} satisfies ToolExample<Input, Output>;
export const glpArchiveLocationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
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
    id: "glp/glp-archive-location-token",
    title: "GLP Archive Location Token",
    description:
      "Qualify an explicit study archive location without accessing storage or determining retention requirements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyId: { type: "string", maxLength: 8192, minLength: 1 },
        archiveContainerId: { type: "string", maxLength: 8192, minLength: 1 },
        locationCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["studyId", "archiveContainerId", "locationCode"],
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
          id: "archiveContainerId",
          label: "Archive Container Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "locationCode",
          label: "Location Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = glpArchiveLocationTokenTool.execute;
export default glpArchiveLocationTokenTool;
