import sade from "sade";

const prog = sade("sane-error-messages");

prog.option("-t, --test", "Testing the waters");

prog
  .command("start")
  .describe("Create your custom project")
  .action(() => {
    console.log('"> building project"');
  });

prog.parse(process.argv);
