import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly communitySources: number;
  readonly independentCorroborations: number;
  readonly minimumCommunitySources: number;
  readonly minimumCorroborations: number;
}>;
export type Output = Readonly<{
  readonly communitySourceMargin: number;
  readonly corroborationMargin: number;
  readonly meetsBothMinimums: boolean;
}>;

export const calculate = (input: Input): Output => {
  return {
    communitySourceMargin:
      input.communitySources - input.minimumCommunitySources,
    corroborationMargin:
      input.independentCorroborations - input.minimumCorroborations,
    meetsBothMinimums:
      input.communitySources >= input.minimumCommunitySources &&
      input.independentCorroborations >= input.minimumCorroborations,
  };
};

export const exampleInput = {
  communitySources: 3,
  independentCorroborations: 2,
  minimumCommunitySources: 2,
  minimumCorroborations: 2,
} satisfies Input;
export const exampleOutput = {
  communitySourceMargin: 1,
  corroborationMargin: 0,
  meetsBothMinimums: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      communitySources: input.communitySources as number,
      independentCorroborations: input.independentCorroborations as number,
      minimumCommunitySources: input.minimumCommunitySources as number,
      minimumCorroborations: input.minimumCorroborations as number,
    }),
  description:
    "Check community-source and independent-corroboration counts against supplied minimums.",
  id: "journalism/community-source-corroboration",
  inputs: [
    {
      id: "communitySources",
      label: "Community sources",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "independentCorroborations",
      label: "Independent corroborations",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "minimumCommunitySources",
      label: "Required community sources",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "minimumCorroborations",
      label: "Required corroborations",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "communitySourceMargin",
      label: "Community-source margin",
      kind: "integer",
    },
    {
      id: "corroborationMargin",
      label: "Corroboration margin",
      kind: "integer",
    },
    {
      id: "meetsBothMinimums",
      label: "Meets both supplied minimums",
      kind: "boolean",
    },
  ],
  title: "Community Source Corroboration",
});

export const run = tool.execute;
export default tool;
