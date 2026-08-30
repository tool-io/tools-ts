import type { ToolExample } from "./example.js";
import { createSimpleTool, simpleError } from "./simple.js";

export type ReferenceEntry = Readonly<{
  source: string;
  statement: string;
}>;

export type ReferenceLookupInput<Topic extends string> = Readonly<{
  topic: Topic;
}>;

export type ReferenceLookupOutput<Topic extends string> = Readonly<{
  source: string;
  statement: string;
  topic: Topic;
}>;

export const createReferenceLookup = <
  const Entries extends Readonly<Record<string, ReferenceEntry>>,
>(config: {
  readonly description: string;
  readonly entries: Entries;
  readonly exampleTopic: Extract<keyof Entries, string>;
  readonly id: string;
  readonly title: string;
}) => {
  type Topic = Extract<keyof Entries, string>;
  type Input = ReferenceLookupInput<Topic>;
  type Output = ReferenceLookupOutput<Topic>;

  const topics = Object.keys(config.entries) as Topic[];
  const lookup = (input: Input): Output => {
    const entry = config.entries[input.topic];
    if (entry === undefined)
      simpleError("topic", "Topic is not supported.", "unsupported_topic");
    return {
      source: entry.source,
      statement: entry.statement,
      topic: input.topic,
    };
  };
  const example = {
    input: { topic: config.exampleTopic },
    output: lookup({ topic: config.exampleTopic }),
  } satisfies ToolExample<Input, Output>;
  const tool = createSimpleTool({
    calculate: (input) => lookup({ topic: input.topic as Topic }),
    description: config.description,
    id: config.id,
    inputs: [
      {
        description: "Reference topic to return.",
        enum: topics,
        id: "topic",
        kind: "string",
        label: "Topic",
      },
    ],
    outputs: [
      {
        description: "Source used for the reference statement.",
        id: "source",
        kind: "string",
        label: "Source",
      },
      {
        description: "Narrow reference statement for the selected topic.",
        id: "statement",
        kind: "string",
        label: "Statement",
      },
      {
        description: "Selected reference topic.",
        enum: topics,
        id: "topic",
        kind: "string",
        label: "Topic",
      },
    ],
    title: config.title,
  });

  return { example, lookup, run: tool.execute, tool };
};
