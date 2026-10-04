import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousHeading: number;
  readonly nextHeading: number;
  readonly suppliedReferenceTurn: number;
  readonly fullTurn: number;
};
export type Output = { readonly signedTurn: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousHeading: { type: "number" },
    nextHeading: { type: "number" },
    suppliedReferenceTurn: { type: "number" },
    fullTurn: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "previousHeading",
    "nextHeading",
    "suppliedReferenceTurn",
    "fullTurn",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedTurn: { type: "number" }, residual: { type: "number" } },
  required: ["signedTurn", "residual"],
} as const;
/** Compare explicit animal-track heading changes using a positive half-turn tie convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousHeading, nextHeading, suppliedReferenceTurn, fullTurn } =
    request;
  const compute = (): Output => {
    H.positive(fullTurn);
    return (() => {
      const r =
          ((nextHeading % fullTurn) - (previousHeading % fullTurn)) % fullTurn,
        p = r < 0 ? r + fullTurn : r,
        signedTurn = p > fullTurn / 2 ? p - fullTurn : p;
      return { signedTurn, residual: signedTurn - suppliedReferenceTurn };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousHeading: 350,
    nextHeading: 10,
    suppliedReferenceTurn: 15,
    fullTurn: 360,
  },
  output: { signedTurn: 20, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const animalTrackTurningGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/animal-track-turning-gap",
    title: "Animal Track Turning Gap Tool",
    description:
      "Compare explicit animal-track heading changes using a positive half-turn tie convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousHeading: { type: "number" },
        nextHeading: { type: "number" },
        suppliedReferenceTurn: { type: "number" },
        fullTurn: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "previousHeading",
        "nextHeading",
        "suppliedReferenceTurn",
        "fullTurn",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedTurn: { type: "number" },
        residual: { type: "number" },
      },
      required: ["signedTurn", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "previousHeading",
          label: "Previous Heading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextHeading",
          label: "Next Heading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReferenceTurn",
          label: "Supplied Reference Turn",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullTurn",
          label: "Full Turn",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedTurn",
          label: "Signed Turn",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = animalTrackTurningGapTool.execute;
export default animalTrackTurningGapTool;
