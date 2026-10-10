import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly subjectId: string;
  readonly predicateId: string;
  readonly objectId: string;
  readonly inversePredicateId: string;
};
export type Output = {
  readonly inverseSubject: string;
  readonly inversePredicate: string;
  readonly inverseObject: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    subjectId: { type: "string", maxLength: 8192, minLength: 1 },
    predicateId: { type: "string", maxLength: 8192, minLength: 1 },
    objectId: { type: "string", maxLength: 8192, minLength: 1 },
    inversePredicateId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["subjectId", "predicateId", "objectId", "inversePredicateId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inverseSubject: { type: "string", maxLength: 8192 },
    inversePredicate: { type: "string", maxLength: 8192 },
    inverseObject: { type: "string", maxLength: 8192 },
  },
  required: ["inverseSubject", "inversePredicate", "inverseObject"],
} as const;
/** Reverse one ontology edge using an explicitly supplied inverse predicate without inferring ontology semantics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { subjectId, predicateId, objectId, inversePredicateId } = request;
  const compute = (): Output => {
    H.domain(
      subjectId.length > 0 &&
        predicateId.length > 0 &&
        objectId.length > 0 &&
        inversePredicateId.length > 0,
      "subjectId",
    );
    return {
      inverseSubject: objectId,
      inversePredicate: inversePredicateId,
      inverseObject: subjectId,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    subjectId: "A",
    predicateId: "parentOf",
    objectId: "B",
    inversePredicateId: "childOf",
  },
  output: {
    inverseSubject: "B",
    inversePredicate: "childOf",
    inverseObject: "A",
  },
} satisfies ToolExample<Input, Output>;
export const ontologyEdgeInverseLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "information-science",
        "information science",
        "information and language sciences",
      ],
      keywords: ["information science", "information and language sciences"],
    },
    id: "information-science/ontology-edge-inverse-label",
    title: "Ontology Edge Inverse Label",
    description:
      "Reverse one ontology edge using an explicitly supplied inverse predicate without inferring ontology semantics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        subjectId: { type: "string", maxLength: 8192, minLength: 1 },
        predicateId: { type: "string", maxLength: 8192, minLength: 1 },
        objectId: { type: "string", maxLength: 8192, minLength: 1 },
        inversePredicateId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["subjectId", "predicateId", "objectId", "inversePredicateId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inverseSubject: { type: "string", maxLength: 8192 },
        inversePredicate: { type: "string", maxLength: 8192 },
        inverseObject: { type: "string", maxLength: 8192 },
      },
      required: ["inverseSubject", "inversePredicate", "inverseObject"],
    },
    ports: {
      inputs: [
        {
          id: "subjectId",
          label: "Subject Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "predicateId",
          label: "Predicate Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "objectId",
          label: "Object Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inversePredicateId",
          label: "Inverse Predicate Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "inverseSubject",
          label: "Inverse Subject",
          valueType: { type: "string" },
        },
        {
          id: "inversePredicate",
          label: "Inverse Predicate",
          valueType: { type: "string" },
        },
        {
          id: "inverseObject",
          label: "Inverse Object",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = ontologyEdgeInverseLabelTool.execute;
export default ontologyEdgeInverseLabelTool;
