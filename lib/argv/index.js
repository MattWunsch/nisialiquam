const yargs = require('yargs');
const colors = require('colors/safe');
const { README_URL } = require('@helpers/endpoints');
const { TOKENPRICE, COMMANDS: { STORE_API_KEY, FETCH } } = require('@utils/constants');

const { argv } = yargs
  .scriptName(TOKENPRICE)
  .strict()
  .usage(`
    ${colors.yellow('Infos:')} ${colors.black.bgWhite(' $0 [-v] [-h] ')}
  `)
  .usage(`
    ${colors.yellow('Store API key:')} ${colors.black.bgWhite(` $0 ${STORE_API_KEY} [key] `)}
  `)
  .usage(`
    ${colors.yellow('Fetch prices:')} ${colors.black.bgWhite(` $0 ${FETCH} [-t <args>] [-c <args>] `)}
  `)
  .example(`$0 ${STORE_API_KEY} dummykey123`, '\'dummykey123\' will be stored in your local machine.')
  .example(`$0 ${FETCH} -t btc eth dgx -c idr`, 'show prices for BTC, ETH and DGX in IDR currency.')
  .epilogue(`README: ${README_URL}`)
  .command(`${STORE_API_KEY} [key]`, 'to store API key in your local machine.', (y) => {
    y
      .positional('key', {
        describe: 'this API key will be stored in your local machine. (<global_node_modules>/TOKENPRICE/api_key).'
        + ' You only need to do this setup process once as the API key will be reusable for future use.'
        + ` For more info on how to get the API key, follow the instructions on: ${README_URL}`,
        type: 'string',
      })
      .demandOption(['key']);
  })
  .command(`${FETCH}`, 'to fetch token prices in selected currency.', (y) => {
    y
      .option('t', {
        alias: 'tokens',
        describe: 'accept multiple token symbols',
        type: 'array',
        default: ['btc', 'eth'],
      })
      .option('c', {
        alias: 'currency',
        describe: 'accept single currency symbol',
        type: 'string',
        nargs: 1,
        default: 'usd',
      });
  })
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version');

if (!argv._[0]) {
  yargs.showHelp();
  console.log('\nError: No command found.');
  process.exit(1);
}

module.exports = argv;
