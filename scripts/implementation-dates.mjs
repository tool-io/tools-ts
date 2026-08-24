export const unknownImplementationDate = "1970-01-01T00:00:00.000Z";

const commitMarker = "@@toolio-author-date:";
const sourcePrefix = "packages/tools/src/";
const sourceSuffix = "/tool.ts";

export const toolSourceFile = (directory) =>
  `${sourcePrefix}${directory}${sourceSuffix}`;

export const parseAddedToolDates = (output) => {
  const dates = new Map();
  let authorDate;
  for (const line of output.split(/\r?\n/u)) {
    if (line.startsWith(commitMarker)) {
      const candidate = line.slice(commitMarker.length).trim();
      authorDate = Number.isNaN(Date.parse(candidate)) ? undefined : candidate;
      continue;
    }
    if (
      authorDate === undefined ||
      !line.startsWith(sourcePrefix) ||
      !line.endsWith(sourceSuffix)
    )
      continue;
    const directory = line.slice(sourcePrefix.length, -sourceSuffix.length);
    if (directory.length > 0) dates.set(directory, authorDate);
  }
  return dates;
};

const parseTrackedFiles = (output) =>
  new Set(
    output
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter(Boolean),
  );

const individualAuthorDate = (directory, runGit) => {
  try {
    const dates = runGit([
      "log",
      "--follow",
      "--diff-filter=A",
      "--format=%aI",
      "--",
      toolSourceFile(directory),
    ])
      .trim()
      .split(/\r?\n/u)
      .filter(Boolean);
    return dates.at(-1);
  } catch {
    return undefined;
  }
};

export const resolveImplementationDates = ({
  directories,
  previousDates,
  runGit,
}) => {
  const dates = new Map();
  const unresolved = [];
  for (const directory of directories) {
    const previous = previousDates.get(directory);
    if (
      previous !== undefined &&
      previous !== unknownImplementationDate &&
      !Number.isNaN(Date.parse(previous))
    )
      dates.set(directory, previous);
    else unresolved.push(directory);
  }
  if (unresolved.length === 0) return dates;

  let addedDates = new Map();
  try {
    addedDates = parseAddedToolDates(
      runGit([
        "log",
        "--diff-filter=A",
        `--format=${commitMarker}%aI`,
        "--name-only",
        "--",
        "packages/tools/src",
      ]),
    );
  } catch {}

  let trackedFiles = new Set();
  const stillUnresolved = unresolved.filter((directory) => {
    const date = addedDates.get(directory);
    if (date !== undefined) dates.set(directory, date);
    return date === undefined;
  });
  if (stillUnresolved.length > 0)
    try {
      trackedFiles = parseTrackedFiles(
        runGit(["ls-files", "--", "packages/tools/src"]),
      );
    } catch {}

  for (const directory of stillUnresolved) {
    const date = trackedFiles.has(toolSourceFile(directory))
      ? individualAuthorDate(directory, runGit)
      : undefined;
    dates.set(directory, date ?? unknownImplementationDate);
  }
  return dates;
};
