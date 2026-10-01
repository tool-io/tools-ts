import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activity: number;
  readonly suppliedActivityPerMole: number;
  readonly molarBasisKnown: boolean;
};
export type Output = {
  readonly molarDefined: boolean;
  readonly molarAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activity: { type: "number" },
    suppliedActivityPerMole: { type: "number", exclusiveMinimum: 0 },
    molarBasisKnown: { type: "boolean" },
  },
  required: ["activity", "suppliedActivityPerMole", "molarBasisKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molarDefined: { type: "boolean" },
    molarAmount: { type: "number" },
  },
  required: ["molarDefined", "molarAmount"],
} as const;
/** Convert only with an explicit supplied activity-per-mole factor and basis-known flag; no assay-specific factor is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activity, suppliedActivityPerMole, molarBasisKnown } = request;
  const compute = (): Output => {
    H.positive(suppliedActivityPerMole);
    return {
      molarDefined: molarBasisKnown,
      molarAmount: molarBasisKnown ? activity / suppliedActivityPerMole : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activity: 20, suppliedActivityPerMole: 4, molarBasisKnown: true },
  output: { molarDefined: true, molarAmount: 5 },
} satisfies ToolExample<Input, Output>;
export const renalAssayActivityMolarUnitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/renal-assay-activity-molar-unit-flag",
    title: "Renal Assay Activity Molar Unit Flag Tool",
    description:
      "Convert only with an explicit supplied activity-per-mole factor and basis-known flag; no assay-specific factor is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        activity: { type: "number" },
        suppliedActivityPerMole: { type: "number", exclusiveMinimum: 0 },
        molarBasisKnown: { type: "boolean" },
      },
      required: ["activity", "suppliedActivityPerMole", "molarBasisKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molarDefined: { type: "boolean" },
        molarAmount: { type: "number" },
      },
      required: ["molarDefined", "molarAmount"],
    },
    ports: {
      inputs: [
        {
          id: "activity",
          label: "Activity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedActivityPerMole",
          label: "Supplied Activity Per Mole",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "molarBasisKnown",
          label: "Molar Basis Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "molarDefined",
          label: "Molar Defined",
          valueType: { type: "boolean" },
        },
        {
          id: "molarAmount",
          label: "Molar Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = renalAssayActivityMolarUnitFlagTool.execute;
export default renalAssayActivityMolarUnitFlagTool;
