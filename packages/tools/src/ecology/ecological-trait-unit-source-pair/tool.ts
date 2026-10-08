import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly traitRecordId: string;
  readonly suppliedUnit: string;
  readonly unitSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    traitRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
    unitSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["traitRecordId", "suppliedUnit", "unitSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit ecological trait unit and source without converting dimensions or assigning trait values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { traitRecordId, suppliedUnit, unitSource } = request;
  const compute = (): Output => {
    H.domain(traitRecordId.length > 0, "traitRecordId");
    H.domain(suppliedUnit.length > 0, "suppliedUnit");
    H.domain(unitSource.length > 0, "unitSource");
    return { token: JSON.stringify([traitRecordId, suppliedUnit, unitSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    traitRecordId: "T17",
    suppliedUnit: "mm",
    unitSource: "protocol P4",
  },
  output: { token: '["T17","mm","protocol P4"]' },
} satisfies ToolExample<Input, Output>;
export const ecologicalTraitUnitSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/ecological-trait-unit-source-pair",
    title: "Ecological Trait Unit Source Pair Tool",
    description:
      "Preserve an explicit ecological trait unit and source without converting dimensions or assigning trait values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        traitRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
        unitSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["traitRecordId", "suppliedUnit", "unitSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "traitRecordId",
          label: "Trait Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedUnit",
          label: "Supplied Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitSource",
          label: "Unit Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ecologicalTraitUnitSourcePairTool.execute;
export default ecologicalTraitUnitSourcePairTool;
