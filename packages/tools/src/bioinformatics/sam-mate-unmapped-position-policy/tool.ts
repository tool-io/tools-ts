import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flag: number;
  readonly mateReference: string;
  readonly matePosition: number;
};
export type Output = {
  readonly mateUnmapped: boolean;
  readonly positionKnown: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flag: { type: "integer", minimum: 0, maximum: 65535 },
    mateReference: { type: "string", maxLength: 8192 },
    matePosition: { type: "integer", minimum: 0 },
  },
  required: ["flag", "mateReference", "matePosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mateUnmapped: { type: "boolean" },
    positionKnown: { type: "boolean" },
  },
  required: ["mateUnmapped", "positionKnown"],
} as const;
/** SAM bit 0x8 reports an unmapped mate even when its coordinate fields carry a placement anchor; do not infer mapping from position alone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flag, mateReference, matePosition } = request;
  const compute = (): Output => {
    H.integer(flag, 0, 65535);
    H.integer(matePosition, 0);
    H.domain(mateReference.length > 0);
    return {
      mateUnmapped: (flag & 8) !== 0,
      positionKnown: mateReference !== "*" && matePosition > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flag: 9, mateReference: "*", matePosition: 0 },
  output: { mateUnmapped: true, positionKnown: false },
} satisfies ToolExample<Input, Output>;
export const samMateUnmappedPositionPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/sam-mate-unmapped-position-policy",
    title: "SAM Mate Unmapped Position Policy Tool",
    description:
      "SAM bit 0x8 reports an unmapped mate even when its coordinate fields carry a placement anchor; do not infer mapping from position alone.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flag: { type: "integer", minimum: 0, maximum: 65535 },
        mateReference: { type: "string", maxLength: 8192 },
        matePosition: { type: "integer", minimum: 0 },
      },
      required: ["flag", "mateReference", "matePosition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mateUnmapped: { type: "boolean" },
        positionKnown: { type: "boolean" },
      },
      required: ["mateUnmapped", "positionKnown"],
    },
    ports: {
      inputs: [
        {
          id: "flag",
          label: "Flag",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "mateReference",
          label: "Mate Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "matePosition",
          label: "Mate Position",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "mateUnmapped",
          label: "Mate Unmapped",
          valueType: { type: "boolean" },
        },
        {
          id: "positionKnown",
          label: "Position Known",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = samMateUnmappedPositionPolicyTool.execute;
export default samMateUnmappedPositionPolicyTool;
