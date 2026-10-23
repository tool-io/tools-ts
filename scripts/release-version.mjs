// SemVer 2.0.0 identifiers: https://semver.org/#spec-item-9
const number = "(?:0|[1-9][0-9]*)";
const identifier = `(?:${number}|[0-9]*[A-Za-z-][0-9A-Za-z-]*)`;
const versionPattern = new RegExp(
  `^(${number})\\.(${number})\\.(${number})(?:-(${identifier}(?:\\.${identifier})*))?(?:\\+([0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*))?$`,
);

export const parseReleaseVersion = (value) => {
  if (typeof value !== "string" || value.trim() !== value) return undefined;
  const match = versionPattern.exec(value);
  if (!match) return undefined;
  return {
    core: `${match[1]}.${match[2]}.${match[3]}`,
    prerelease: match[4]?.split(".") ?? [],
    build: match[5]?.split(".") ?? [],
  };
};

export const releaseVersionIssues = (manifest) => {
  const version = parseReleaseVersion(manifest.version);
  if (!version) return ["Package version must use Semantic Versioning 2.0.0."];
  const issues = [];
  if (version.build.length)
    issues.push(
      "Release artifacts must use a new version, not build metadata.",
    );
  const [channel] = version.prerelease;
  if (channel !== undefined) {
    if (!["alpha", "beta", "rc"].includes(channel))
      issues.push(
        "Release prereleases must use an alpha, beta or rc identifier.",
      );
    if (manifest.publishConfig?.tag !== channel)
      issues.push(
        "Prerelease npm distribution tag must match its release channel; never publish it as latest.",
      );
  } else if (
    manifest.publishConfig?.tag &&
    manifest.publishConfig.tag !== "latest"
  ) {
    issues.push(
      "A release without a prerelease suffix must use the latest npm distribution tag.",
    );
  }
  return issues;
};
