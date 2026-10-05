import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cardinality: number;
  readonly alreadyPresent: boolean;
  readonly inserting: boolean;
};
export type Output = {
  readonly updatedCardinality: number;
  readonly delta: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cardinality: { type: "integer", minimum: 0 },
    alreadyPresent: { type: "boolean" },
    inserting: { type: "boolean" },
  },
  required: ["cardinality", "alreadyPresent", "inserting"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    updatedCardinality: { type: "integer" },
    delta: { type: "integer" },
  },
  required: ["updatedCardinality", "delta"],
} as const;
/** Update finite-set cardinality for one insertion or deletion given an explicit pre-operation membership flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cardinality, alreadyPresent, inserting } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(cardinality) &&
        cardinality >= 0 &&
        cardinality <= Number.MAX_SAFE_INTEGER,
      "cardinality",
    ),
      cardinality);
    H.domain(!alreadyPresent || cardinality > 0, "alreadyPresent");
    return (() => {
      const delta = inserting
        ? alreadyPresent
          ? 0
          : 1
        : alreadyPresent
          ? -1
          : 0;
      return { updatedCardinality: cardinality + delta, delta };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cardinality: 5, alreadyPresent: false, inserting: true },
  output: { updatedCardinality: 6, delta: 1 },
} satisfies ToolExample<Input, Output>;
export const finiteSetCardinalityUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "set/finite-set-cardinality-update",
    title: "Finite Set Cardinality Update Tool",
    description:
      "Update finite-set cardinality for one insertion or deletion given an explicit pre-operation membership flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cardinality: { type: "integer", minimum: 0 },
        alreadyPresent: { type: "boolean" },
        inserting: { type: "boolean" },
      },
      required: ["cardinality", "alreadyPresent", "inserting"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        updatedCardinality: { type: "integer" },
        delta: { type: "integer" },
      },
      required: ["updatedCardinality", "delta"],
    },
    ports: {
      inputs: [
        {
          id: "cardinality",
          label: "Cardinality",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "alreadyPresent",
          label: "Already Present",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "inserting",
          label: "Inserting",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "updatedCardinality",
          label: "Updated Cardinality",
          valueType: { type: "integer" },
        },
        { id: "delta", label: "Delta", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = finiteSetCardinalityUpdateTool.execute;
export default finiteSetCardinalityUpdateTool;
