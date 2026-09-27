import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly disagreementCoordinate: number;
  readonly referenceCoordinate: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    disagreementCoordinate: { type: "number" },
    referenceCoordinate: { type: "number" },
  },
  required: ["disagreementCoordinate", "referenceCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare one supplied disagreement payoff coordinate with an explicit reference, without normalization or a bargaining solution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { disagreementCoordinate, referenceCoordinate } = request;
  const compute = (): Output => {
    return { gap: disagreementCoordinate - referenceCoordinate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { disagreementCoordinate: 3, referenceCoordinate: 1 },
  output: { gap: 2 },
} satisfies ToolExample<Input, Output>;
export const bargainingDisagreementCoordinateGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/bargaining-disagreement-coordinate-gap",
      title: "Bargaining Disagreement Coordinate Gap Tool",
      description:
        "Compare one supplied disagreement payoff coordinate with an explicit reference, without normalization or a bargaining solution.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          disagreementCoordinate: { type: "number" },
          referenceCoordinate: { type: "number" },
        },
        required: ["disagreementCoordinate", "referenceCoordinate"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { gap: { type: "number" } },
        required: ["gap"],
      },
      ports: {
        inputs: [
          {
            id: "disagreementCoordinate",
            label: "Disagreement Coordinate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceCoordinate",
            label: "Reference Coordinate",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
      },
    },
    calculate,
  });
export const run = bargainingDisagreementCoordinateGapTool.execute;
export default bargainingDisagreementCoordinateGapTool;
