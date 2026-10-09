import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deviationId: string;
  readonly protocolVersion: string;
  readonly stepCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviationId: { type: "string", maxLength: 8192, minLength: 1 },
    protocolVersion: { type: "string", maxLength: 8192, minLength: 1 },
    stepCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deviationId", "protocolVersion", "stepCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit deviation by protocol version and step without evaluating its impact. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deviationId, protocolVersion, stepCode } = request;
  const compute = (): Output => {
    H.domain(deviationId.length > 0, "deviationId");
    H.domain(protocolVersion.length > 0, "protocolVersion");
    H.domain(stepCode.length > 0, "stepCode");
    return { token: JSON.stringify([deviationId, protocolVersion, stepCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deviationId: "DEV17", protocolVersion: "v2", stepCode: "STEP3" },
  output: { token: '["DEV17","v2","STEP3"]' },
} satisfies ToolExample<Input, Output>;
export const glpDeviationProtocolStepLabelTool = H.defineSchemaCalculation<
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
    id: "glp/glp-deviation-protocol-step-label",
    title: "GLP Deviation Protocol Step Label",
    description:
      "Qualify an explicit deviation by protocol version and step without evaluating its impact.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviationId: { type: "string", maxLength: 8192, minLength: 1 },
        protocolVersion: { type: "string", maxLength: 8192, minLength: 1 },
        stepCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["deviationId", "protocolVersion", "stepCode"],
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
          id: "deviationId",
          label: "Deviation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "protocolVersion",
          label: "Protocol Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stepCode",
          label: "Step Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = glpDeviationProtocolStepLabelTool.execute;
export default glpDeviationProtocolStepLabelTool;
