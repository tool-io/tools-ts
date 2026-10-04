import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly checkPosition: number;
  readonly positionIsOneBased: boolean;
};
export type Output = {
  readonly zeroBasedPosition: number;
  readonly validPosition: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    checkPosition: { type: "integer" },
    positionIsOneBased: { type: "boolean" },
  },
  required: ["length", "checkPosition", "positionIsOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroBasedPosition: { type: "integer" },
    validPosition: { type: "boolean" },
  },
  required: ["zeroBasedPosition", "validPosition"],
} as const;
/** Inspect an explicit check-digit position convention without computing or validating a checksum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, checkPosition, positionIsOneBased } = request;
  const compute = (): Output => {
    H.integer(length, 0);
    const zeroBasedPosition = checkPosition - (positionIsOneBased ? 1 : 0);
    return {
      zeroBasedPosition,
      validPosition: zeroBasedPosition >= 0 && zeroBasedPosition < length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 13, checkPosition: 13, positionIsOneBased: true },
  output: { zeroBasedPosition: 12, validPosition: true },
} satisfies ToolExample<Input, Output>;
export const checkDigitPositionContractTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/check-digit-position-contract",
    title: "Check Digit Position Contract Tool",
    description:
      "Inspect an explicit check-digit position convention without computing or validating a checksum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 0 },
        checkPosition: { type: "integer" },
        positionIsOneBased: { type: "boolean" },
      },
      required: ["length", "checkPosition", "positionIsOneBased"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroBasedPosition: { type: "integer" },
        validPosition: { type: "boolean" },
      },
      required: ["zeroBasedPosition", "validPosition"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "checkPosition",
          label: "Check Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "positionIsOneBased",
          label: "Position Is One Based",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "zeroBasedPosition",
          label: "Zero Based Position",
          valueType: { type: "integer" },
        },
        {
          id: "validPosition",
          label: "Valid Position",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = checkDigitPositionContractTool.execute;
export default checkDigitPositionContractTool;
