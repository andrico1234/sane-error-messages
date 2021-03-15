"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sade_1 = tslib_1.__importDefault(require("sade"));
const fs = tslib_1.__importStar(require("fs-extra"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const ora_1 = tslib_1.__importDefault(require("ora"));
const path_1 = tslib_1.__importDefault(require("path"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const enquirer_1 = require("enquirer");
const execa_1 = tslib_1.__importDefault(require("execa"));
const defaultTemplate_1 = tslib_1.__importDefault(require("./defaultTemplate"));
const composePackageJson_1 = require("./composePackageJson");
const utils_1 = require("./utils");
const prog = sade_1.default("sane-error-messages");
prog.version("0.1.0");
prog
    .command("create <dirName>")
    .describe("Creates the project in your chosen directory")
    .action(async (pkg) => {
    const bootSpinner = ora_1.default(`Creating ${chalk_1.default.bold.green(pkg)}...`);
    let template;
    async function getProjectPath(projectPath) {
        const exists = await fs.pathExists(projectPath);
        if (!exists) {
            return projectPath;
        }
        bootSpinner.fail(`A folder named ${chalk_1.default.bold.red(pkg)} already exists! ${chalk_1.default.bold("Choose a different name")}`);
        throw Error("A folder already exists");
    }
    try {
        //   // get the project path
        const realPath = await fs.realpath(process.cwd());
        let projectPath = await getProjectPath(realPath + "/" + pkg);
        console.log(projectPath);
        bootSpinner.start();
        await fs.copy(path_1.default.resolve(__dirname, `../templates/default`), projectPath, {
            overwrite: true,
        });
        // fix gitignore
        await fs.move(path_1.default.resolve(projectPath, "./gitignore"), path_1.default.resolve(projectPath, "./.gitignore"));
        // update license year and author
        let license = await fs.readFile(path_1.default.resolve(projectPath, "LICENSE"), { encoding: "utf-8" });
        license = license.replace(/<year>/, `${new Date().getFullYear()}`);
        bootSpinner.stop();
        const { author } = await enquirer_1.prompt({
            type: "input",
            name: "author",
            message: "Who is the package author?",
        });
        utils_1.setAuthorName(author);
        bootSpinner.start();
        license = license.replace(/<author>/, author.trim());
        await fs.writeFile(path_1.default.resolve(projectPath, "LICENSE"), license, {
            encoding: "utf-8",
        });
        const templateConfig = defaultTemplate_1.default;
        const generatePackageJson = composePackageJson_1.composePackageJson(templateConfig);
        // Install deps
        process.chdir(projectPath);
        const safeName = utils_1.safePackageName(pkg);
        const pkgJson = generatePackageJson({ name: safeName, author });
        const nodeVersionReq = utils_1.getNodeEngineRequirement(pkgJson);
        if (nodeVersionReq &&
            !semver_1.default.satisfies(process.version, nodeVersionReq)) {
            bootSpinner.fail(`Unsupported Node version! Your current Node version (${chalk_1.default.red(process.version)}) does not satisfy the requirement of Node ${chalk_1.default.cyan(nodeVersionReq)}.`);
            process.exit(1);
        }
        await fs.outputJSON(path_1.default.resolve(projectPath, "package.json"), pkgJson);
        bootSpinner.succeed(`Created ${chalk_1.default.bold.green(pkg)}`);
        // displayStartMessage(pkg);
    }
    catch (error) {
        bootSpinner.fail(`Failed to create ${chalk_1.default.bold.red(pkg)}`);
        console.error(error);
        process.exit(1);
    }
    const { dependencies: deps } = defaultTemplate_1.default;
    const installSpinner = ora_1.default(utils_1.getInstallingMessage(deps.sort())).start();
    try {
        await execa_1.default("yarn", ["add", ...deps, "--dev"]);
        installSpinner.succeed("Installed dependencies");
        console.log(utils_1.displayStartMessage(pkg));
    }
    catch (error) {
        installSpinner.fail("Failed to install dependencies");
        console.error(error);
        process.exit(1);
    }
});
prog.parse(process.argv);
// create a new directory
// copy the files over
