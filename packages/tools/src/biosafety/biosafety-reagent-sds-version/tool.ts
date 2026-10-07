import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reagentId: string;
  readonly sdsId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reagentId: { type: "string", maxLength: 8192, minLength: 1 },
    sdsId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reagentId", "sdsId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit safety-data-sheet reference by version without retrieving or interpreting handling guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reagentId, sdsId, version } = request;
  const compute = (): Output => {
    H.domain(reagentId.length > 0, "reagentId");
    H.domain(sdsId.length > 0, "sdsId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([reagentId, sdsId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reagentId: "RG17", sdsId: "SDS2", version: "v2" },
  output: { token: '["RG17","SDS2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const biosafetyReagentSdsVersionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosafety", "research and quality management"],
      keywords: ["biosafety", "research and quality management"],
    },
    id: "biosafety/biosafety-reagent-sds-version",
    title: "Biosafety Reagent SDS Version",
    description:
      "Qualify an explicit safety-data-sheet reference by version without retrieving or interpreting handling guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reagentId: { type: "string", maxLength: 8192, minLength: 1 },
        sdsId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["reagentId", "sdsId", "version"],
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
          id: "reagentId",
          label: "Reagent Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sdsId",
          label: "Sds Id",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biosafetyReagentSdsVersionTool.execute;
export default biosafetyReagentSdsVersionTool;
