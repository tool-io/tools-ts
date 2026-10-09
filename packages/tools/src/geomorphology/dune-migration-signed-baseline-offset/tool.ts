import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baselinePosition: number;
  readonly laterPosition: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselinePosition: { type: "number" },
    laterPosition: { type: "number" },
  },
  required: ["baselinePosition", "laterPosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied later-minus-baseline dune position along one explicit signed survey axis without deriving transport rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baselinePosition, laterPosition } = request;
  const compute = (): Output => {
    return { signedGap: laterPosition - baselinePosition };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baselinePosition: 12, laterPosition: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const duneMigrationSignedBaselineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/dune-migration-signed-baseline-offset",
    title: "Dune Migration Signed Baseline Offset Tool",
    description:
      "Calculate supplied later-minus-baseline dune position along one explicit signed survey axis without deriving transport rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselinePosition: { type: "number" },
        laterPosition: { type: "number" },
      },
      required: ["baselinePosition", "laterPosition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "baselinePosition",
          label: "Baseline Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "laterPosition",
          label: "Later Position",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = duneMigrationSignedBaselineOffsetTool.execute;
export default duneMigrationSignedBaselineOffsetTool;
