import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerRadius: number;
  readonly implementWidth: number;
  readonly turnRadians: number;
};
export type Output = {
  readonly innerLength: number;
  readonly outerLength: number;
  readonly pathGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerRadius: { type: "number" },
    implementWidth: { type: "number", minimum: 0 },
    turnRadians: { type: "number" },
  },
  required: ["centerRadius", "implementWidth", "turnRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerLength: { type: "number" },
    outerLength: { type: "number" },
    pathGap: { type: "number" },
  },
  required: ["innerLength", "outerLength", "pathGap"],
} as const;
/** Calculate implement turn inner outer path gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerRadius, implementWidth, turnRadians } = request;
  const compute = (): Output => {
    H.domain(implementWidth >= 0 && centerRadius >= implementWidth / 2);
    return {
      innerLength: (centerRadius - implementWidth / 2) * Math.abs(turnRadians),
      outerLength: (centerRadius + implementWidth / 2) * Math.abs(turnRadians),
      pathGap: implementWidth * Math.abs(turnRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    centerRadius: 10,
    implementWidth: 4,
    turnRadians: 1.5707963267948966,
  },
  output: {
    innerLength: 12.566370614359172,
    outerLength: 18.84955592153876,
    pathGap: 6.283185307179586,
  },
} satisfies ToolExample<Input, Output>;
export const implementTurnInnerOuterPathGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "precision-agriculture/implement-turn-inner-outer-path-gap",
    title: "Implement Turn Inner Outer Path Gap Tool",
    description:
      "Calculate implement turn inner outer path gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerRadius: { type: "number" },
        implementWidth: { type: "number", minimum: 0 },
        turnRadians: { type: "number" },
      },
      required: ["centerRadius", "implementWidth", "turnRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerLength: { type: "number" },
        outerLength: { type: "number" },
        pathGap: { type: "number" },
      },
      required: ["innerLength", "outerLength", "pathGap"],
    },
    ports: {
      inputs: [
        {
          id: "centerRadius",
          label: "Center Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "implementWidth",
          label: "Implement Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "turnRadians",
          label: "Turn Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "innerLength",
          label: "Inner Length",
          valueType: { type: "number" },
        },
        {
          id: "outerLength",
          label: "Outer Length",
          valueType: { type: "number" },
        },
        { id: "pathGap", label: "Path Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = implementTurnInnerOuterPathGapTool.execute;
export default implementTurnInnerOuterPathGapTool;
