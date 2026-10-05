import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedArity: number;
  readonly suppliedArgumentCount: number;
};
export type Output = {
  readonly arityMatches: boolean;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedArity: { type: "integer", minimum: 0 },
    suppliedArgumentCount: { type: "integer", minimum: 0 },
  },
  required: ["expectedArity", "suppliedArgumentCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arityMatches: { type: "boolean" },
    difference: { type: "integer" },
  },
  required: ["arityMatches", "difference"],
} as const;
/** Check an explicitly supplied predicate application argument count against its declared arity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedArity, suppliedArgumentCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(expectedArity) &&
        expectedArity >= 0 &&
        expectedArity <= Number.MAX_SAFE_INTEGER,
      "expectedArity",
    ),
      expectedArity);
    (H.domain(
      Number.isSafeInteger(suppliedArgumentCount) &&
        suppliedArgumentCount >= 0 &&
        suppliedArgumentCount <= Number.MAX_SAFE_INTEGER,
      "suppliedArgumentCount",
    ),
      suppliedArgumentCount);
    return {
      arityMatches: expectedArity === suppliedArgumentCount,
      difference: suppliedArgumentCount - expectedArity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedArity: 2, suppliedArgumentCount: 3 },
  output: { arityMatches: false, difference: 1 },
} satisfies ToolExample<Input, Output>;
export const predicateApplicationArityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/predicate-application-arity",
    title: "Predicate Application Arity Tool",
    description:
      "Check an explicitly supplied predicate application argument count against its declared arity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedArity: { type: "integer", minimum: 0 },
        suppliedArgumentCount: { type: "integer", minimum: 0 },
      },
      required: ["expectedArity", "suppliedArgumentCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arityMatches: { type: "boolean" },
        difference: { type: "integer" },
      },
      required: ["arityMatches", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "expectedArity",
          label: "Expected Arity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedArgumentCount",
          label: "Supplied Argument Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "arityMatches",
          label: "Arity Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = predicateApplicationArityTool.execute;
export default predicateApplicationArityTool;
