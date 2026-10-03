import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inspirationZero: number;
  readonly expirationZero: number;
  readonly suppliedCommonZero: number;
};
export type Output = {
  readonly inspirationOffset: number;
  readonly expirationOffset: number;
  readonly zeroDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inspirationZero: { type: "number" },
    expirationZero: { type: "number" },
    suppliedCommonZero: { type: "number" },
  },
  required: ["inspirationZero", "expirationZero", "suppliedCommonZero"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inspirationOffset: { type: "number" },
    expirationOffset: { type: "number" },
    zeroDifference: { type: "number" },
  },
  required: ["inspirationOffset", "expirationOffset", "zeroDifference"],
} as const;
/** Calculate breath reference zero gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inspirationZero, expirationZero, suppliedCommonZero } = request;
  const compute = (): Output => {
    return {
      inspirationOffset: inspirationZero - suppliedCommonZero,
      expirationOffset: expirationZero - suppliedCommonZero,
      zeroDifference: expirationZero - inspirationZero,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inspirationZero: 2, expirationZero: 5, suppliedCommonZero: 1 },
  output: { inspirationOffset: 1, expirationOffset: 4, zeroDifference: 3 },
} satisfies ToolExample<Input, Output>;
export const breathReferenceZeroGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/breath-reference-zero-gap",
    title: "Breath Reference Zero Gap Tool",
    description:
      "Calculate breath reference zero gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inspirationZero: { type: "number" },
        expirationZero: { type: "number" },
        suppliedCommonZero: { type: "number" },
      },
      required: ["inspirationZero", "expirationZero", "suppliedCommonZero"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inspirationOffset: { type: "number" },
        expirationOffset: { type: "number" },
        zeroDifference: { type: "number" },
      },
      required: ["inspirationOffset", "expirationOffset", "zeroDifference"],
    },
    ports: {
      inputs: [
        {
          id: "inspirationZero",
          label: "Inspiration Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expirationZero",
          label: "Expiration Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCommonZero",
          label: "Supplied Common Zero",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "inspirationOffset",
          label: "Inspiration Offset",
          valueType: { type: "number" },
        },
        {
          id: "expirationOffset",
          label: "Expiration Offset",
          valueType: { type: "number" },
        },
        {
          id: "zeroDifference",
          label: "Zero Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = breathReferenceZeroGapTool.execute;
export default breathReferenceZeroGapTool;
