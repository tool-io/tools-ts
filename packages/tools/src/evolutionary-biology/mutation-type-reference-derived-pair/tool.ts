import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceBase: string;
  readonly derivedBase: string;
};
export type Output = {
  readonly changed: boolean;
  readonly classification: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceBase: {
      type: "string",
      maxLength: 8192,
      enum: ["A", "C", "G", "T"],
    },
    derivedBase: {
      type: "string",
      maxLength: 8192,
      enum: ["A", "C", "G", "T"],
    },
  },
  required: ["referenceBase", "derivedBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    changed: { type: "boolean" },
    classification: { type: "string", maxLength: 8192 },
  },
  required: ["changed", "classification"],
} as const;
/** Classify one explicit unambiguous DNA base substitution as unchanged, transition, or transversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceBase, derivedBase } = request;
  const compute = (): Output => {
    H.domain(["A", "C", "G", "T"].includes(referenceBase), "referenceBase");
    H.domain(["A", "C", "G", "T"].includes(derivedBase), "derivedBase");
    return {
      changed: referenceBase !== derivedBase,
      classification:
        referenceBase === derivedBase
          ? "unchanged"
          : ("AG".includes(referenceBase) && "AG".includes(derivedBase)) ||
              ("CT".includes(referenceBase) && "CT".includes(derivedBase))
            ? "transition"
            : "transversion",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceBase: "A", derivedBase: "G" },
  output: { changed: true, classification: "transition" },
} satisfies ToolExample<Input, Output>;
export const mutationTypeReferenceDerivedPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["evolutionary-biology", "evolutionary biology", "biology"],
      keywords: ["evolutionary biology", "biology"],
    },
    id: "evolutionary-biology/mutation-type-reference-derived-pair",
    title: "Mutation Type Reference Derived Pair",
    description:
      "Classify one explicit unambiguous DNA base substitution as unchanged, transition, or transversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceBase: {
          type: "string",
          maxLength: 8192,
          enum: ["A", "C", "G", "T"],
        },
        derivedBase: {
          type: "string",
          maxLength: 8192,
          enum: ["A", "C", "G", "T"],
        },
      },
      required: ["referenceBase", "derivedBase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        changed: { type: "boolean" },
        classification: { type: "string", maxLength: 8192 },
      },
      required: ["changed", "classification"],
    },
    ports: {
      inputs: [
        {
          id: "referenceBase",
          label: "Reference Base",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "derivedBase",
          label: "Derived Base",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "changed", label: "Changed", valueType: { type: "boolean" } },
        {
          id: "classification",
          label: "Classification",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = mutationTypeReferenceDerivedPairTool.execute;
export default mutationTypeReferenceDerivedPairTool;
