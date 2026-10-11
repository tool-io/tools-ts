import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly implantId: string;
  readonly connectionWording: string;
  readonly specificationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    implantId: { type: "string", maxLength: 8192, minLength: 1 },
    connectionWording: { type: "string", maxLength: 8192, minLength: 1 },
    specificationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["implantId", "connectionWording", "specificationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit implant-connection wording and source without determining component compatibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { implantId, connectionWording, specificationSource } = request;
  const compute = (): Output => {
    H.domain(implantId.length > 0, "implantId");
    H.domain(connectionWording.length > 0, "connectionWording");
    H.domain(specificationSource.length > 0, "specificationSource");
    return {
      token: JSON.stringify([
        implantId,
        connectionWording,
        specificationSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    implantId: "I17",
    connectionWording: "connection A",
    specificationSource: "Manufacturer sheet",
  },
  output: { token: '["I17","connection A","Manufacturer sheet"]' },
} satisfies ToolExample<Input, Output>;
export const implantConnectionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["prosthodontics", "health and medicine"],
      keywords: ["prosthodontics", "health and medicine"],
    },
    id: "prosthodontics/implant-connection-label",
    title: "Implant Connection Label",
    description:
      "Record explicit implant-connection wording and source without determining component compatibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        implantId: { type: "string", maxLength: 8192, minLength: 1 },
        connectionWording: { type: "string", maxLength: 8192, minLength: 1 },
        specificationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["implantId", "connectionWording", "specificationSource"],
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
          id: "implantId",
          label: "Implant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "connectionWording",
          label: "Connection Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "specificationSource",
          label: "Specification Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = implantConnectionLabelTool.execute;
export default implantConnectionLabelTool;
