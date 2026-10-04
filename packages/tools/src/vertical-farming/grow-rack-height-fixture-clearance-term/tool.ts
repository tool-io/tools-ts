import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roomHeight: number;
  readonly shelfLevels: number;
  readonly shelfPitch: number;
  readonly base: number;
  readonly fixtureDepth: number;
  readonly topAllowance: number;
};
export type Output = { readonly remainingClearance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roomHeight: { type: "number", minimum: 0 },
    shelfLevels: { type: "integer", minimum: 1 },
    shelfPitch: { type: "number", minimum: 0 },
    base: { type: "number", minimum: 0 },
    fixtureDepth: { type: "number", minimum: 0 },
    topAllowance: { type: "number", minimum: 0 },
  },
  required: [
    "roomHeight",
    "shelfLevels",
    "shelfPitch",
    "base",
    "fixtureDepth",
    "topAllowance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingClearance: { type: "number" } },
  required: ["remainingClearance"],
} as const;
/** Calculate grow rack height fixture clearance term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    roomHeight,
    shelfLevels,
    shelfPitch,
    base,
    fixtureDepth,
    topAllowance,
  } = request;
  const compute = (): Output => {
    H.integer(shelfLevels, 1);
    H.domain(
      roomHeight >= 0 &&
        shelfPitch >= 0 &&
        base >= 0 &&
        fixtureDepth >= 0 &&
        topAllowance >= 0,
    );
    return {
      remainingClearance:
        roomHeight -
        base -
        (shelfLevels - 1) * shelfPitch -
        fixtureDepth -
        topAllowance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roomHeight: 3,
    shelfLevels: 5,
    shelfPitch: 0.5,
    base: 0.2,
    fixtureDepth: 0.1,
    topAllowance: 0.2,
  },
  output: { remainingClearance: 0.49999999999999983 },
} satisfies ToolExample<Input, Output>;
export const growRackHeightFixtureClearanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/grow-rack-height-fixture-clearance-term",
    title: "Grow Rack Height Fixture Clearance Term Tool",
    description:
      "Calculate grow rack height fixture clearance term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roomHeight: { type: "number", minimum: 0 },
        shelfLevels: { type: "integer", minimum: 1 },
        shelfPitch: { type: "number", minimum: 0 },
        base: { type: "number", minimum: 0 },
        fixtureDepth: { type: "number", minimum: 0 },
        topAllowance: { type: "number", minimum: 0 },
      },
      required: [
        "roomHeight",
        "shelfLevels",
        "shelfPitch",
        "base",
        "fixtureDepth",
        "topAllowance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingClearance: { type: "number" } },
      required: ["remainingClearance"],
    },
    ports: {
      inputs: [
        {
          id: "roomHeight",
          label: "Room Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shelfLevels",
          label: "Shelf Levels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shelfPitch",
          label: "Shelf Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "base",
          label: "Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixtureDepth",
          label: "Fixture Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "topAllowance",
          label: "Top Allowance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingClearance",
          label: "Remaining Clearance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = growRackHeightFixtureClearanceTermTool.execute;
export default growRackHeightFixtureClearanceTermTool;
