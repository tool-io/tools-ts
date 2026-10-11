import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly springConstant: number;
  readonly coordinate: number;
  readonly suppliedUnstretchedCoordinate: number;
};
export type Output = { readonly restoringForce: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    springConstant: { type: "number", minimum: 0 },
    coordinate: { type: "number" },
    suppliedUnstretchedCoordinate: { type: "number" },
  },
  required: ["springConstant", "coordinate", "suppliedUnstretchedCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { restoringForce: { type: "number" } },
  required: ["restoringForce"],
} as const;
/** Calculate ideal one-axis Hooke restoring force from an explicit positive-direction coordinate and unstretched reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { springConstant, coordinate, suppliedUnstretchedCoordinate } = request;
  const compute = (): Output => {
    H.domain(springConstant >= 0, "springConstant");
    return {
      restoringForce:
        -springConstant * (coordinate - suppliedUnstretchedCoordinate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    springConstant: 100,
    coordinate: 0.2,
    suppliedUnstretchedCoordinate: 0.1,
  },
  output: { restoringForce: -10 },
} satisfies ToolExample<Input, Output>;
export const springForceReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physics"],
      keywords: ["physics"],
    },
    id: "physics/spring-force-reference-offset",
    title: "Spring Force Reference Offset",
    description:
      "Calculate ideal one-axis Hooke restoring force from an explicit positive-direction coordinate and unstretched reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        springConstant: { type: "number", minimum: 0 },
        coordinate: { type: "number" },
        suppliedUnstretchedCoordinate: { type: "number" },
      },
      required: [
        "springConstant",
        "coordinate",
        "suppliedUnstretchedCoordinate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { restoringForce: { type: "number" } },
      required: ["restoringForce"],
    },
    ports: {
      inputs: [
        {
          id: "springConstant",
          label: "Spring Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coordinate",
          label: "Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUnstretchedCoordinate",
          label: "Supplied Unstretched Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "restoringForce",
          label: "Restoring Force",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = springForceReferenceOffsetTool.execute;
export default springForceReferenceOffsetTool;
