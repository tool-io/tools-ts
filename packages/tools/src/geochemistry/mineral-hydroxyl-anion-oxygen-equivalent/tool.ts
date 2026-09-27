import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hydroxylCount: number;
  readonly fluorineCount: number;
  readonly chlorineCount: number;
  readonly oxygenCount: number;
};
export type Output = {
  readonly totalAnions: number;
  readonly oxygenEquivalent: number;
  readonly negativeCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hydroxylCount: { type: "number", minimum: 0 },
    fluorineCount: { type: "number", minimum: 0 },
    chlorineCount: { type: "number", minimum: 0 },
    oxygenCount: { type: "number", minimum: 0 },
  },
  required: ["hydroxylCount", "fluorineCount", "chlorineCount", "oxygenCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalAnions: { type: "number" },
    oxygenEquivalent: { type: "number" },
    negativeCharge: { type: "number" },
  },
  required: ["totalAnions", "oxygenEquivalent", "negativeCharge"],
} as const;
/** Formal anion charge accounting for O2-, OH-, F- and Cl-, without mineral identification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hydroxylCount, fluorineCount, chlorineCount, oxygenCount } = request;
  const compute = (): Output => {
    H.domain(
      hydroxylCount >= 0 &&
        fluorineCount >= 0 &&
        chlorineCount >= 0 &&
        oxygenCount >= 0,
    );
    return {
      totalAnions: hydroxylCount + fluorineCount + chlorineCount + oxygenCount,
      oxygenEquivalent:
        oxygenCount + (hydroxylCount + fluorineCount + chlorineCount) / 2,
      negativeCharge:
        2 * oxygenCount + hydroxylCount + fluorineCount + chlorineCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hydroxylCount: 2,
    fluorineCount: 1,
    chlorineCount: 1,
    oxygenCount: 6,
  },
  output: { totalAnions: 10, oxygenEquivalent: 8, negativeCharge: 16 },
} satisfies ToolExample<Input, Output>;
export const mineralHydroxylAnionOxygenEquivalentTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/mineral-hydroxyl-anion-oxygen-equivalent",
      title: "Mineral Hydroxyl Anion Oxygen Equivalent Tool",
      description:
        "Formal anion charge accounting for O2-, OH-, F- and Cl-, without mineral identification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hydroxylCount: { type: "number", minimum: 0 },
          fluorineCount: { type: "number", minimum: 0 },
          chlorineCount: { type: "number", minimum: 0 },
          oxygenCount: { type: "number", minimum: 0 },
        },
        required: [
          "hydroxylCount",
          "fluorineCount",
          "chlorineCount",
          "oxygenCount",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalAnions: { type: "number" },
          oxygenEquivalent: { type: "number" },
          negativeCharge: { type: "number" },
        },
        required: ["totalAnions", "oxygenEquivalent", "negativeCharge"],
      },
      ports: {
        inputs: [
          {
            id: "hydroxylCount",
            label: "Hydroxyl Count",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fluorineCount",
            label: "Fluorine Count",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "chlorineCount",
            label: "Chlorine Count",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oxygenCount",
            label: "Oxygen Count",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalAnions",
            label: "Total Anions",
            valueType: { type: "number" },
          },
          {
            id: "oxygenEquivalent",
            label: "Oxygen Equivalent",
            valueType: { type: "number" },
          },
          {
            id: "negativeCharge",
            label: "Negative Charge",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = mineralHydroxylAnionOxygenEquivalentTool.execute;
export default mineralHydroxylAnionOxygenEquivalentTool;
