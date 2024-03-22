#!/usr/bin/env node
require('module-alias/register');
const fs = require('fs');
const fetch = require('node-fetch');
const colors = require('colors/safe');
const argv = require('@lib/argv');
const { BASE_URL } = require('@helpers/endpoints');
const { TOKENPRICE, COMMANDS: { STORE_API_KEY, FETCH } } = require('@utils/constants');

if (argv._[0] === STORE_API_KEY) {
  try {
    fs.writeFile(`${__dirname}/api_key`, argv.key, (err) => {
      if (err) {
        console.log(`
          ${colors.red('ERROR')}: Permission denied, you need to use sudo.

          ${colors.black.bgWhite(` sudo ${TOKENPRICE} ${STORE_API_KEY} [key] `)}

          For more info on this: ${colors.black.bgWhite(` ${TOKENPRICE} --help `)}
        `);
        process.exit(1);
      }
      console.log(`
        ${colors.green('SUCCESS')}: API key is now successfully stored on your local machine.
      `);
    });
  } catch (err) {
    console.log(`
      ${colors.red('ERROR')}: ${err.message}
    
      For more info on this: ${colors.black.bgWhite(` ${TOKENPRICE} --help `)}
    `);
  }
}

if (argv._[0] === FETCH) {
  try {
    fs.readFile(`${__dirname}/api_key`, 'utf8', (err, API_KEY) => {
      if (err) {
        console.log(`
          ${colors.red('ERROR')}: You need to store API key in your local machine in order to fetch token prices.

          For more info on this: ${colors.black.bgWhite(` ${TOKENPRICE} --help `)}
        `);
        process.exit(1);
      }

      const ids = argv.t.join(',').toUpperCase();
      const curr = argv.c.toUpperCase();

      const API_URL = `${BASE_URL}?key=${API_KEY}&ids=${ids}&interval=1d&convert=${curr}`;

      fetch(API_URL)
        .then((res) => res.json())
        .then((prices) => {
          if (prices.length === 0) {
            console.log(colors.red(`No prices found for ${colors.red.underline.bold(ids)}`));
            return;
          }
          for (let i = 0; i < prices.length; i += 1) {
            const { symbol, name, price } = prices[i];
            const moneyFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: curr }).format(price);
            console.log(`${colors.yellow.bold(`${name} (${symbol}):`)} ${colors.bold(moneyFormat)}`);
          }
        })
        .catch((error) => console.log(`
          ${colors.red('ERROR')}: Failed to fetch price(s). 

          ${error.message}

          For more info on this: ${colors.black.bgWhite(` ${TOKENPRICE} --help `)}
      `));
    });
  } catch (err) {
    console.log(`
      ${colors.red('ERROR')}: ${err.message}

      For more info on this: ${colors.black.bgWhite(` ${TOKENPRICE} --help `)}
    `);
  }
}
