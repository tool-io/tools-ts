import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly suppliedDomainSize: number };
export type Output = {
  readonly empty: boolean;
  readonly universalVacuityApplies: boolean;
  readonly existentialWitnessPossible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { suppliedDomainSize: { type: "integer", minimum: 0 } },
  required: ["suppliedDomainSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    empty: { type: "boolean" },
    universalVacuityApplies: { type: "boolean" },
    existentialWitnessPossible: { type: "boolean" },
  },
  required: ["empty", "universalVacuityApplies", "existentialWitnessPossible"],
} as const;
/** Report elementary empty-domain quantifier flags from an explicit finite domain size without evaluating a predicate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDomainSize } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(suppliedDomainSize) &&
        suppliedDomainSize >= 0 &&
        suppliedDomainSize <= Number.MAX_SAFE_INTEGER,
      "suppliedDomainSize",
    ),
      suppliedDomainSize);
    return {
      empty: suppliedDomainSize === 0,
      universalVacuityApplies: suppliedDomainSize === 0,
      existentialWitnessPossible: suppliedDomainSize > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedDomainSize: 0 },
  output: {
    empty: true,
    universalVacuityApplies: true,
    existentialWitnessPossible: false,
  },
} satisfies ToolExample<Input, Output>;
export const quantifierDomainEmptinessFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["philosophy"],
      keywords: ["philosophy"],
    },
    id: "philosophy/quantifier-domain-emptiness-flag",
    title: "Quantifier Domain Emptiness Flag",
    description:
      "Report elementary empty-domain quantifier flags from an explicit finite domain size without evaluating a predicate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { suppliedDomainSize: { type: "integer", minimum: 0 } },
      required: ["suppliedDomainSize"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        empty: { type: "boolean" },
        universalVacuityApplies: { type: "boolean" },
        existentialWitnessPossible: { type: "boolean" },
      },
      required: [
        "empty",
        "universalVacuityApplies",
        "existentialWitnessPossible",
      ],
    },
    ports: {
      inputs: [
        {
          id: "suppliedDomainSize",
          label: "Supplied Domain Size",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "empty", label: "Empty", valueType: { type: "boolean" } },
        {
          id: "universalVacuityApplies",
          label: "Universal Vacuity Applies",
          valueType: { type: "boolean" },
        },
        {
          id: "existentialWitnessPossible",
          label: "Existential Witness Possible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = quantifierDomainEmptinessFlagTool.execute;
export default quantifierDomainEmptinessFlagTool;
