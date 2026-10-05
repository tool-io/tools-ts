import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly paverLength: number;
  readonly jointWidth: number;
  readonly moduleCount: number;
};
export type Output = {
  readonly repeatModule: number;
  readonly totalRun: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paverLength: { type: "number", minimum: 0 },
    jointWidth: { type: "number", minimum: 0 },
    moduleCount: { type: "integer", minimum: 0 },
  },
  required: ["paverLength", "jointWidth", "moduleCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repeatModule: { type: "number" },
    totalRun: { type: "number" },
  },
  required: ["repeatModule", "totalRun"],
} as const;
/** Compute a paver repeat module and a run including only internal joints, excluding joints at both run ends. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { paverLength, jointWidth, moduleCount } = request;
  const compute = (): Output => {
    H.domain(paverLength >= 0 && jointWidth >= 0, "paverLength");
    (H.domain(
      Number.isSafeInteger(moduleCount) &&
        moduleCount >= 0 &&
        moduleCount <= Number.MAX_SAFE_INTEGER,
      "moduleCount",
    ),
      moduleCount);
    return {
      repeatModule: paverLength + jointWidth,
      totalRun:
        moduleCount * paverLength + Math.max(0, moduleCount - 1) * jointWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { paverLength: 200, jointWidth: 5, moduleCount: 4 },
  output: { repeatModule: 205, totalRun: 815 },
} satisfies ToolExample<Input, Output>;
export const paverJointModuleSpacingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/paver-joint-module-spacing",
    title: "Paver Joint Module Spacing Tool",
    description:
      "Compute a paver repeat module and a run including only internal joints, excluding joints at both run ends.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        paverLength: { type: "number", minimum: 0 },
        jointWidth: { type: "number", minimum: 0 },
        moduleCount: { type: "integer", minimum: 0 },
      },
      required: ["paverLength", "jointWidth", "moduleCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        repeatModule: { type: "number" },
        totalRun: { type: "number" },
      },
      required: ["repeatModule", "totalRun"],
    },
    ports: {
      inputs: [
        {
          id: "paverLength",
          label: "Paver Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "jointWidth",
          label: "Joint Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "moduleCount",
          label: "Module Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "repeatModule",
          label: "Repeat Module",
          valueType: { type: "number" },
        },
        { id: "totalRun", label: "Total Run", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = paverJointModuleSpacingTool.execute;
export default paverJointModuleSpacingTool;
