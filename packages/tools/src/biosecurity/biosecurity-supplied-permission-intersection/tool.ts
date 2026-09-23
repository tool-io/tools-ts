import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: readonly string[];
  readonly second: readonly string[];
  readonly requested: readonly string[];
  readonly deny: readonly string[];
};
export type Output = {
  readonly shared: readonly string[];
  readonly allowed: readonly string[];
  readonly deniedRequested: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    second: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requested: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    deny: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["first", "second", "requested", "deny"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shared: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    allowed: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    deniedRequested: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["shared", "allowed", "deniedRequested"],
} as const;
/** Intersect explicit permission tokens and apply supplied denials without changing authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, requested, deny } = request;
  const compute = (): Output => {
    const shared = [...new Set(first.filter((x) => second.includes(x)))];
    return {
      shared,
      allowed: [
        ...new Set(
          requested.filter((x) => shared.includes(x) && !deny.includes(x)),
        ),
      ],
      deniedRequested: [
        ...new Set(
          requested.filter((x) => !shared.includes(x) || deny.includes(x)),
        ),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    first: ["read", "audit"],
    second: ["read", "audit"],
    requested: ["read", "audit", "write"],
    deny: ["audit"],
  },
  output: {
    shared: ["read", "audit"],
    allowed: ["read"],
    deniedRequested: ["audit", "write"],
  },
} satisfies ToolExample<Input, Output>;
export const biosecuritySuppliedPermissionIntersectionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-supplied-permission-intersection",
      title: "Biosecurity Supplied Permission Intersection Tool",
      description:
        "Intersect explicit permission tokens and apply supplied denials without changing authorization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          first: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          second: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          requested: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          deny: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["first", "second", "requested", "deny"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shared: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          allowed: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          deniedRequested: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["shared", "allowed", "deniedRequested"],
      },
      ports: {
        inputs: [
          {
            id: "first",
            label: "First",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "second",
            label: "Second",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "requested",
            label: "Requested",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "deny",
            label: "Deny",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "shared",
            label: "Shared",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "allowed",
            label: "Allowed",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "deniedRequested",
            label: "Denied Requested",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecuritySuppliedPermissionIntersectionTool.execute;
export default biosecuritySuppliedPermissionIntersectionTool;
