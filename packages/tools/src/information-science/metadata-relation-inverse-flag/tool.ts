import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forward: string;
  readonly suppliedInverse: string;
  readonly knownRelations: readonly string[];
  readonly inverseRelations: readonly string[];
};
export type Output = {
  readonly known: boolean;
  readonly inverseMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forward: { type: "string", maxLength: 8192 },
    suppliedInverse: { type: "string", maxLength: 8192 },
    knownRelations: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    inverseRelations: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "forward",
    "suppliedInverse",
    "knownRelations",
    "inverseRelations",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    known: { type: "boolean" },
    inverseMatches: { type: "boolean" },
  },
  required: ["known", "inverseMatches"],
} as const;
/** Compare an explicit inverse-relation map without asserting semantic inverse properties from names. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forward, suppliedInverse, knownRelations, inverseRelations } =
    request;
  const compute = (): Output => {
    H.sameLength(knownRelations, inverseRelations);
    H.domain(new Set(knownRelations).size === knownRelations.length);
    const i = knownRelations.indexOf(forward);
    return {
      known: i >= 0,
      inverseMatches: i >= 0 && inverseRelations[i] === suppliedInverse,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    forward: "parent",
    suppliedInverse: "child",
    knownRelations: ["parent"],
    inverseRelations: ["child"],
  },
  output: { known: true, inverseMatches: true },
} satisfies ToolExample<Input, Output>;
export const metadataRelationInverseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/metadata-relation-inverse-flag",
    title: "Metadata Relation Inverse Flag Tool",
    description:
      "Compare an explicit inverse-relation map without asserting semantic inverse properties from names.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forward: { type: "string", maxLength: 8192 },
        suppliedInverse: { type: "string", maxLength: 8192 },
        knownRelations: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        inverseRelations: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "forward",
        "suppliedInverse",
        "knownRelations",
        "inverseRelations",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        known: { type: "boolean" },
        inverseMatches: { type: "boolean" },
      },
      required: ["known", "inverseMatches"],
    },
    ports: {
      inputs: [
        {
          id: "forward",
          label: "Forward",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedInverse",
          label: "Supplied Inverse",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "knownRelations",
          label: "Known Relations",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "inverseRelations",
          label: "Inverse Relations",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "known", label: "Known", valueType: { type: "boolean" } },
        {
          id: "inverseMatches",
          label: "Inverse Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = metadataRelationInverseFlagTool.execute;
export default metadataRelationInverseFlagTool;
