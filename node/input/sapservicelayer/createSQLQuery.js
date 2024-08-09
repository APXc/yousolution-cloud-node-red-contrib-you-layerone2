process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const Support = require('../../../utils/reqengine');
const { VerifyErrorLayerOneSL } = require('../../../utils/manageErrorLayerOneSL');
module.exports = function (RED) {
  function CreateSQLQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    // reset status
    node.status({});

    node.on('input', async (msg, send, done) => {
      // reset status
      node.status({});
      try {
        // const data = msg[config.bodyPost];
        const data = {
          SqlCode: msg[config.sqlCode],
          SqlName: msg[config.sqlName],
          SqlText: msg[config.sqlText],
        };

        if (!data.SqlCode || !data.SqlName || !data.SqlText) {
          const missingParams = [];
          data.SqlCode ? null : missingParams.push('SqlCode');
          data.SqlName ? null : missingParams.push('SqlName');
          data.SqlText ? null : missingParams.push('SqlText');
          done(new Error(`Missing mandatory params: ${missingParams.join(',')}.`));
          return;
        }

        const options = { method: 'POST', hasRawQuery: false, isCreateSQLQuery: true, data: data };
        const login = Support.login;
        const result = await Support.sendRequest({ node, msg, config, axios, login, options });
        msg.payload = VerifyErrorLayerOneSL( node, msg , result);
        msg.statusCode = result.status;
        if(msg.payload) {
          node.status({ fill: 'green', shape: 'dot', text: 'success' });
          node.send(msg);
        }

      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'Error' });
        done(error);
      }
    });
  }
  RED.nodes.registerType('you-layerone2-sl-create-sql-query', CreateSQLQuery, {});
};
