import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parasitized: number;
  readonly examined: number;
  readonly unresolved: number;
  readonly excludeUnresolved: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parasitized: { type: "integer", minimum: 0 },
    examined: { type: "integer", minimum: 1 },
    unresolved: { type: "integer", minimum: 0 },
    excludeUnresolved: { type: "boolean" },
  },
  required: ["parasitized", "examined", "unresolved", "excludeUnresolved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    fraction: { type: "number" },
  },
  required: ["denominator", "fraction"],
} as const;
/** Calculate biological control observed parasitism share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parasitized, examined, unresolved, excludeUnresolved } = request;
  const compute = (): Output => {
    H.integer(examined, 1);
    H.integer(unresolved, 0, examined);
    H.integer(parasitized, 0, examined - unresolved);
    H.domain(examined - (excludeUnresolved ? unresolved : 0) > 0);
    return {
      denominator: examined - (excludeUnresolved ? unresolved : 0),
      fraction: parasitized / (examined - (excludeUnresolved ? unresolved : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parasitized: 20,
    examined: 100,
    unresolved: 20,
    excludeUnresolved: true,
  },
  output: { denominator: 80, fraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const biologicalControlObservedParasitismShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroecology/biological-control-observed-parasitism-share",
      title: "Biological Control Observed Parasitism Share Tool",
      description:
        "Calculate biological control observed parasitism share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parasitized: { type: "integer", minimum: 0 },
          examined: { type: "integer", minimum: 1 },
          unresolved: { type: "integer", minimum: 0 },
          excludeUnresolved: { type: "boolean" },
        },
        required: [
          "parasitized",
          "examined",
          "unresolved",
          "excludeUnresolved",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          fraction: { type: "number" },
        },
        required: ["denominator", "fraction"],
      },
      ports: {
        inputs: [
          {
            id: "parasitized",
            label: "Parasitized",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "examined",
            label: "Examined",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unresolved",
            label: "Unresolved",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludeUnresolved",
            label: "Exclude Unresolved",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = biologicalControlObservedParasitismShareTool.execute;
export default biologicalControlObservedParasitismShareTool;
