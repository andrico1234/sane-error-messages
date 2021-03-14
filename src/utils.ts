import { PackageJson } from "type-fest";
import shell from "shelljs";
import chalk from "chalk";

export function getNodeEngineRequirement({ engines }: PackageJson) {
  return engines && engines.node;
}

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "");

export function setAuthorName(author: string) {
  shell.exec(`npm config set init-author-name "${author}"`, { silent: true });
}

export const displayStartMessage = function (projectName: string) {
  const commands = {
    install: "yarn install",
    build: "yarn build",
    start: "yarn start",
    test: "yarn test",
  };

  const cmd = (msg: string) => chalk.bold(chalk.cyan(msg));

  return `
  ${chalk.green("Awesome!")} You're now ready to start coding.
  
  I already ran ${cmd(commands.install)} for you, so your next steps are:
    ${cmd(`cd ${projectName}`)}
  
  To start developing (rebuilds on changes):
    ${cmd(commands.start)}
  
  To build for production:
    ${cmd(commands.build)}
  To test your library with Jest:
    ${cmd(commands.test)}
`;
};

export const getInstallingMessage = function (packages: string[]) {
  const pkgText = packages
    .map(function (pkg) {
      return `    ${chalk.cyan(chalk.bold(pkg))}`;
    })
    .join("\n");

  return `Installing npm modules:
${pkgText}
`;
};
