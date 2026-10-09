import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisName: string;
  readonly authorityNamespace: string;
  readonly code: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisName: { type: "string", maxLength: 8192, minLength: 1 },
    authorityNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    code: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["axisName", "authorityNamespace", "code"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit coordinate-axis code by authority namespace without resolving a coordinate system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisName, authorityNamespace, code } = request;
  const compute = (): Output => {
    H.domain(axisName.length > 0, "axisName");
    H.domain(authorityNamespace.length > 0, "authorityNamespace");
    H.domain(code.length > 0, "code");
    return { token: JSON.stringify([axisName, authorityNamespace, code]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    axisName: "latitude",
    authorityNamespace: "Authority A",
    code: "AX2",
  },
  output: { token: '["latitude","Authority A","AX2"]' },
} satisfies ToolExample<Input, Output>;
export const coordinateAxisAuthorityTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geography", "earth and environmental sciences"],
      keywords: ["geography", "earth and environmental sciences"],
    },
    id: "geography/coordinate-axis-authority-tag",
    title: "Coordinate Axis Authority Tag",
    description:
      "Qualify an explicit coordinate-axis code by authority namespace without resolving a coordinate system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisName: { type: "string", maxLength: 8192, minLength: 1 },
        authorityNamespace: { type: "string", maxLength: 8192, minLength: 1 },
        code: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["axisName", "authorityNamespace", "code"],
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
          id: "axisName",
          label: "Axis Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorityNamespace",
          label: "Authority Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = coordinateAxisAuthorityTagTool.execute;
export default coordinateAxisAuthorityTagTool;
