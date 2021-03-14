import sade from "sade";
import * as fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import semver from "semver";
import { prompt } from "enquirer";
import execa from "execa";

import defaultTemplate from "./defaultTemplate";
import { composePackageJson } from "./composePackageJson";
import {
  displayStartMessage,
  getNodeEngineRequirement,
  safePackageName,
  setAuthorName,
  getInstallingMessage,
} from "./utils";

const prog = sade("sane-error-messages");

prog.version("0.1.0");

prog
  .command("start <dirName>")
  .describe("Creates the project in your chosen directory")
  .action(async (pkg: string) => {
    const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`);
    let template;

    async function getProjectPath(projectPath: string): Promise<string> {
      const exists = await fs.pathExists(projectPath);
      if (!exists) {
        return projectPath;
      }

      bootSpinner.fail(
        `A folder named ${chalk.bold.red(pkg)} already exists! ${chalk.bold(
          "Choose a different name"
        )}`
      );

      throw Error("A folder already exists");
    }

    try {
      //   // get the project path
      const realPath = await fs.realpath(process.cwd());
      let projectPath = await getProjectPath(realPath + "/" + pkg);

      console.log(projectPath);

      bootSpinner.start();

      await fs.copy(
        path.resolve(__dirname, `../templates/default`),
        projectPath,
        {
          overwrite: true,
        }
      );
      // fix gitignore
      await fs.move(
        path.resolve(projectPath, "./gitignore"),
        path.resolve(projectPath, "./.gitignore")
      );

      // update license year and author
      let license: string = await fs.readFile(
        path.resolve(projectPath, "LICENSE"),
        { encoding: "utf-8" }
      );

      license = license.replace(/<year>/, `${new Date().getFullYear()}`);

      bootSpinner.stop();

      const { author } = await prompt<{ author: string }>({
        type: "input",
        name: "author",
        message: "Who is the package author?",
      });

      setAuthorName(author);
      bootSpinner.start();

      license = license.replace(/<author>/, author.trim());

      await fs.writeFile(path.resolve(projectPath, "LICENSE"), license, {
        encoding: "utf-8",
      });

      const templateConfig = defaultTemplate;
      const generatePackageJson = composePackageJson(templateConfig);

      // Install deps
      process.chdir(projectPath);
      const safeName = safePackageName(pkg);
      const pkgJson = generatePackageJson({ name: safeName, author });
      const nodeVersionReq = getNodeEngineRequirement(pkgJson);

      if (
        nodeVersionReq &&
        !semver.satisfies(process.version, nodeVersionReq)
      ) {
        bootSpinner.fail(
          `Unsupported Node version! Your current Node version (${chalk.red(
            process.version
          )}) does not satisfy the requirement of Node ${chalk.cyan(
            nodeVersionReq
          )}.`
        );
        process.exit(1);
      }

      await fs.outputJSON(path.resolve(projectPath, "package.json"), pkgJson);
      bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
      // displayStartMessage(pkg);
    } catch (error) {
      bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
      console.error(error);
      process.exit(1);
    }

    const { dependencies: deps } = defaultTemplate;

    const installSpinner = ora(getInstallingMessage(deps.sort())).start();

    try {
      await execa("yarn", ["add", ...deps, "--dev"]);
      installSpinner.succeed("Installed dependencies");
      console.log(displayStartMessage(pkg));
    } catch (error) {
      installSpinner.fail("Failed to install dependencies");
      console.error(error);
      process.exit(1);
    }
  });
prog.parse(process.argv);

// create a new directory
// copy the files over
