import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableWidth: number;
  readonly moduleCount: number;
  readonly moduleWidth: number;
  readonly internalJointWidth: number;
  readonly leftEdgeJoint: number;
  readonly rightEdgeJoint: number;
};
export type Output = { readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableWidth: { type: "number", minimum: 0 },
    moduleCount: { type: "integer", minimum: 0 },
    moduleWidth: { type: "number", minimum: 0 },
    internalJointWidth: { type: "number", minimum: 0 },
    leftEdgeJoint: { type: "number", minimum: 0 },
    rightEdgeJoint: { type: "number", minimum: 0 },
  },
  required: [
    "availableWidth",
    "moduleCount",
    "moduleWidth",
    "internalJointWidth",
    "leftEdgeJoint",
    "rightEdgeJoint",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainder: { type: "number" } },
  required: ["remainder"],
} as const;
/** Return one residual facade width after supplied modules and explicit internal/edge joints. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    availableWidth,
    moduleCount,
    moduleWidth,
    internalJointWidth,
    leftEdgeJoint,
    rightEdgeJoint,
  } = request;
  const compute = (): Output => {
    H.integer(moduleCount, 0);
    H.domain(
      availableWidth >= 0 &&
        moduleWidth >= 0 &&
        internalJointWidth >= 0 &&
        leftEdgeJoint >= 0 &&
        rightEdgeJoint >= 0,
    );
    return {
      remainder:
        availableWidth -
        moduleCount * moduleWidth -
        Math.max(0, moduleCount - 1) * internalJointWidth -
        leftEdgeJoint -
        rightEdgeJoint,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableWidth: 10,
    moduleCount: 4,
    moduleWidth: 2,
    internalJointWidth: 0.1,
    leftEdgeJoint: 0.2,
    rightEdgeJoint: 0.2,
  },
  output: { remainder: 1.3 },
} satisfies ToolExample<Input, Output>;
export const facadeModuleRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/facade-module-remainder",
    title: "Facade Module Remainder Tool",
    description:
      "Return one residual facade width after supplied modules and explicit internal/edge joints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableWidth: { type: "number", minimum: 0 },
        moduleCount: { type: "integer", minimum: 0 },
        moduleWidth: { type: "number", minimum: 0 },
        internalJointWidth: { type: "number", minimum: 0 },
        leftEdgeJoint: { type: "number", minimum: 0 },
        rightEdgeJoint: { type: "number", minimum: 0 },
      },
      required: [
        "availableWidth",
        "moduleCount",
        "moduleWidth",
        "internalJointWidth",
        "leftEdgeJoint",
        "rightEdgeJoint",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainder: { type: "number" } },
      required: ["remainder"],
    },
    ports: {
      inputs: [
        {
          id: "availableWidth",
          label: "Available Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moduleCount",
          label: "Module Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "moduleWidth",
          label: "Module Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "internalJointWidth",
          label: "Internal Joint Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftEdgeJoint",
          label: "Left Edge Joint",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightEdgeJoint",
          label: "Right Edge Joint",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = facadeModuleRemainderTool.execute;
export default facadeModuleRemainderTool;
