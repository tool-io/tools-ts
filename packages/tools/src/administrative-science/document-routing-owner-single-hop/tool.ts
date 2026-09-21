import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentOwner: string;
  readonly fromOwners: readonly string[];
  readonly toOwners: readonly string[];
};
export type Output = { readonly nextOwner: string; readonly routed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentOwner: { type: "string", maxLength: 8192 },
    fromOwners: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    toOwners: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["currentOwner", "fromOwners", "toOwners"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nextOwner: { type: "string", maxLength: 8192 },
    routed: { type: "boolean" },
  },
  required: ["nextOwner", "routed"],
} as const;
/** Resolve one caller-defined routing edge without recursively traversing a workflow. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentOwner, fromOwners, toOwners } = request;
  const compute = (): Output => {
    H.sameLength(fromOwners, toOwners);
    H.domain(new Set(fromOwners).size === fromOwners.length);
    const index = fromOwners.indexOf(currentOwner);
    return {
      nextOwner: index < 0 ? currentOwner : toOwners[index],
      routed: index >= 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentOwner: "A", fromOwners: ["A", "B"], toOwners: ["B", "C"] },
  output: { nextOwner: "B", routed: true },
} satisfies ToolExample<Input, Output>;
export const documentRoutingOwnerSingleHopTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/document-routing-owner-single-hop",
    title: "Document Routing Owner Single Hop Tool",
    description:
      "Resolve one caller-defined routing edge without recursively traversing a workflow.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentOwner: { type: "string", maxLength: 8192 },
        fromOwners: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        toOwners: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["currentOwner", "fromOwners", "toOwners"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextOwner: { type: "string", maxLength: 8192 },
        routed: { type: "boolean" },
      },
      required: ["nextOwner", "routed"],
    },
    ports: {
      inputs: [
        {
          id: "currentOwner",
          label: "Current Owner",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fromOwners",
          label: "From Owners",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "toOwners",
          label: "To Owners",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "nextOwner", label: "Next Owner", valueType: { type: "string" } },
        { id: "routed", label: "Routed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = documentRoutingOwnerSingleHopTool.execute;
export default documentRoutingOwnerSingleHopTool;
