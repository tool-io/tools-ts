import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mode: string;
  readonly supportRoles: readonly string[];
  readonly selfReported: boolean;
};
export type Output = {
  readonly supported: boolean;
  readonly proxy: boolean;
  readonly sourceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: {
      type: "string",
      maxLength: 8192,
      enum: ["spoken", "typed", "pointed", "proxy"],
    },
    supportRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    selfReported: { type: "boolean" },
  },
  required: ["mode", "supportRoles", "selfReported"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supported: { type: "boolean" },
    proxy: { type: "boolean" },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["supported", "proxy", "sourceKey"],
} as const;
/** Retain response mode, support roles and explicit self/proxy provenance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mode, supportRoles, selfReported } = request;
  const compute = (): Output => {
    H.domain(["spoken", "typed", "pointed", "proxy"].includes(mode), "mode");
    return {
      supported: supportRoles.length > 0,
      proxy: !selfReported || mode === "proxy",
      sourceKey: JSON.stringify([
        mode,
        selfReported,
        [...new Set(supportRoles)].sort(),
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mode: "pointed", supportRoles: ["assistant"], selfReported: true },
  output: {
    supported: true,
    proxy: false,
    sourceKey: '["pointed",true,["assistant"]]',
  },
} satisfies ToolExample<Input, Output>;
export const occupationalFormSupportedResponseTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "occupational-therapy/occupational-form-supported-response-tag",
      title: "Occupational Form Supported Response Tag Tool",
      description:
        "Retain response mode, support roles and explicit self/proxy provenance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mode: {
            type: "string",
            maxLength: 8192,
            enum: ["spoken", "typed", "pointed", "proxy"],
          },
          supportRoles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          selfReported: { type: "boolean" },
        },
        required: ["mode", "supportRoles", "selfReported"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          supported: { type: "boolean" },
          proxy: { type: "boolean" },
          sourceKey: { type: "string", maxLength: 8192 },
        },
        required: ["supported", "proxy", "sourceKey"],
      },
      ports: {
        inputs: [
          {
            id: "mode",
            label: "Mode",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "supportRoles",
            label: "Support Roles",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "selfReported",
            label: "Self Reported",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "supported",
            label: "Supported",
            valueType: { type: "boolean" },
          },
          { id: "proxy", label: "Proxy", valueType: { type: "boolean" } },
          {
            id: "sourceKey",
            label: "Source Key",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = occupationalFormSupportedResponseTagTool.execute;
export default occupationalFormSupportedResponseTagTool;
