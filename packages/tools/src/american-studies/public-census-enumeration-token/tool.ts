import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: string;
  readonly editionNamespace: string;
  readonly separator: string;
};
export type Output = {
  readonly namespace: string;
  readonly components: readonly string[];
  readonly unresolvedSuffix: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    editionNamespace: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "editionNamespace", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    namespace: { type: "string", maxLength: 8192 },
    components: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unresolvedSuffix: { type: "string", maxLength: 8192 },
  },
  required: ["namespace", "components", "unresolvedSuffix"],
} as const;
/** Parse a supplied edition namespace and two opaque enumeration-reference components, preserving unresolved suffix text without inferring people or places. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, editionNamespace, separator } = request;
  const compute = (): Output => {
    H.domain(
      editionNamespace.length > 0 &&
        separator.length > 0 &&
        reference.startsWith(editionNamespace + separator),
    );
    const tail = reference.slice(editionNamespace.length + separator.length),
      components = tail.split(separator);
    H.domain(components.length >= 2 && components.every((x) => x.length > 0));
    return {
      namespace: editionNamespace,
      components: components.slice(0, 2),
      unresolvedSuffix: components.slice(2).join(separator),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reference: "E1900/ED12/P3/x",
    editionNamespace: "E1900",
    separator: "/",
  },
  output: {
    namespace: "E1900",
    components: ["ED12", "P3"],
    unresolvedSuffix: "x",
  },
} satisfies ToolExample<Input, Output>;
export const publicCensusEnumerationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/public-census-enumeration-token",
    title: "Public Census Enumeration Token Tool",
    description:
      "Parse a supplied edition namespace and two opaque enumeration-reference components, preserving unresolved suffix text without inferring people or places.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        editionNamespace: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "editionNamespace", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        namespace: { type: "string", maxLength: 8192 },
        components: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unresolvedSuffix: { type: "string", maxLength: 8192 },
      },
      required: ["namespace", "components", "unresolvedSuffix"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "editionNamespace",
          label: "Edition Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "namespace", label: "Namespace", valueType: { type: "string" } },
        {
          id: "components",
          label: "Components",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unresolvedSuffix",
          label: "Unresolved Suffix",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCensusEnumerationTokenTool.execute;
export default publicCensusEnumerationTokenTool;
