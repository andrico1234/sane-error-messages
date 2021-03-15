"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstallingMessage = exports.displayStartMessage = exports.setAuthorName = exports.safePackageName = exports.getNodeEngineRequirement = void 0;
const tslib_1 = require("tslib");
const shelljs_1 = tslib_1.__importDefault(require("shelljs"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
function getNodeEngineRequirement({ engines }) {
    return engines && engines.node;
}
exports.getNodeEngineRequirement = getNodeEngineRequirement;
const safePackageName = (name) => name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "");
exports.safePackageName = safePackageName;
function setAuthorName(author) {
    shelljs_1.default.exec(`npm config set init-author-name "${author}"`, { silent: true });
}
exports.setAuthorName = setAuthorName;
const displayStartMessage = function (projectName) {
    const commands = {
        install: "yarn install",
        build: "yarn build",
        start: "yarn start",
        test: "yarn test",
    };
    const cmd = (msg) => chalk_1.default.bold(chalk_1.default.cyan(msg));
    return `
  ${chalk_1.default.green("Awesome!")} You're now ready to start coding.
  
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
exports.displayStartMessage = displayStartMessage;
const getInstallingMessage = function (packages) {
    const pkgText = packages
        .map(function (pkg) {
        return `    ${chalk_1.default.cyan(chalk_1.default.bold(pkg))}`;
    })
        .join("\n");
    return `Installing npm modules:
${pkgText}
`;
};
exports.getInstallingMessage = getInstallingMessage;
